"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, startGame } from "../components/flappyBird";
import { Address } from "~~/components/scaffold-eth";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { flappyAbi } from "~~/contracts/abi";
import { erc20Abi } from "~~/contracts/abi";

export default function Home() {
  const { address } = useAccount();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [depositOrApprove, setDepositOrApprove] = useState<"approve" | "deposit">("approve");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameOverRef = useRef(gameOver);
  const { writeContract, error, context, data: hash, status, isPending } = useWriteContract()

  const chainId = useChainId()
  const arbSepoliaContract = "0xB1C533983f2a39694E7F7fF8BD3161866BDca1D8"
  const baseSepoliaContract = "0x3c652E75FCEb8165228D4A3984BCF17E53805BD3"
  const arbSepoliaErc20 = "0xb1d4538b4571d411f07960ef2838ce337fe1e80e"
  const baseSepoliaErc20 = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410"

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: chainId == 421614 ? arbSepoliaErc20 : baseSepoliaErc20,
    functionName: "allowance",
    args: [
      address,
      chainId == 421614 ? arbSepoliaContract : baseSepoliaContract,
    ]
  })

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      if (address) {
        socket.emit('registerAccount', address);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('players', (count: number) => {
      setPlayers(count);
    });

    socket.on('countdown', (count: number) => {
      setCountdown(count);
      if (count <= 0) {
        setCountdown(null);
        setGameStarted(true);
        setGameOver(false);
        startGame(canvasRef, setGameStarted, setGameOver, gameOverRef);
      }
    });

    socket.on('gameResult', ({ result, opponent }) => {
      setGameOver(true);
      setGameResult(result);
      setOpponent(opponent);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('players');
      socket.off('countdown');
      socket.off('startGame');
      socket.off('gameResult');
    };
  }, [address]);


  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setGameResult(null);
    setOpponent(null);
  };

  useEffect(() => {
    if (allowance as number > 0) {
      setDepositOrApprove("deposit")
    } else {
      setDepositOrApprove("approve")
    }
  }, [allowance])

  const handleDeposit = () => {
    writeContract({
      abi: flappyAbi,
      address: chainId == 421614 ? arbSepoliaContract : baseSepoliaContract,
      functionName: "deposit",
      args: [ //IERC20 _token, uint256 _amount
        1e18
      ]
    })
  }

  const handleApprove = () => {
    writeContract({
      abi: erc20Abi,
      address: chainId == 421614 ? arbSepoliaErc20 : baseSepoliaErc20,
      functionName: "deposit",
      args: [ //IERC20 _token, uint256 _amount
        1e18
      ]
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden relative">
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <div className={`w-6 h-6 rounded-full ${players > 1 ? "bg-green-500" : "bg-red-500"}`}></div>
            <p className="ml-2">
              {players} {players === 1 ? "player" : "players"} online
            </p>
          </div>
          {countdown !== null ? (
            <p className="text-6xl mb-4 text-black">Starting in {countdown}</p>
          ) : (
            <p className="text-2xl font-bold mb-4">Waiting for Player 2...</p>
          )}
        </div>
      )}
      {gameOver && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center ${gameResult === "lose" ? "bg-black bg-opacity-70" : "bg-primary"}`}
        >
          <span className={`text-6xl font-bold mb-8 ${gameResult === "lose" ? "text-white" : "text-black"}`}>
            {gameResult === "lose" ? "GAME OVER :(" : "YOU WIN :)"}
          </span>
          {gameResult === "lose" && opponent && (
            <p className="text-xl text-white items-center flex flex-col">
              You lost to: <Address address={opponent} />
            </p>
          )}
          {gameResult === "win" && opponent && (
            <p className="text-xl text-black items-center flex flex-col">
              You won against: <Address address={opponent} />
            </p>
          )}
          <button onClick={restartGame} className="bg-white text-blue-500 font-bold py-2 px-4 rounded mt-4 text-xl">
            Home
          </button>
          {/* {
            depositOrApprove == "deposit" ?
              < button onClick={() => handleDeposit()} className="bg-white text-blue-500 font-bold py-2 px-4 rounded mt-4 text-xl">
                Deposit
              </button> :
              < button onClick={() => handleApprove()} className="bg-white text-blue-500 font-bold py-2 px-4 rounded mt-4 text-xl">
                Approve
              </button>
          } */}
        </div>
      )
      }
      <canvas ref={canvasRef} id="board" className="w-full h-full fixed top-0 left-0" />
    </div >
  );
}
