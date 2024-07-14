"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, startGame } from "../components/flappyBird";
import { Address } from "~~/components/scaffold-eth";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { flappyAbi, erc20Abi } from "~~/contracts/abi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";

export default function Home() {
  const { address } = useAccount();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameOverRef = useRef(gameOver);

  const { writeContractAsync } = useScaffoldWriteContract("YourContract");

  const handlePayment = async () => {
    console.log("Making deposit...");

    /*
    try {
      const txResponse = await writeContractAsync({
        functionName: "deposit",
        args: [], // No arguments are needed for the deposit function
        value: parseEther("0.02"), // This sends 2 ETH with the transaction
      }, {
        onBlockConfirmation: (txnReceipt) => {
          console.log("📦 Transaction confirmed, blockHash:", txnReceipt.blockHash);
          setPaid(true);
        }
      });
    } catch (e) {
      console.error("Error making deposit:", e);
    }*/
    setPaid(true);
  };

  useEffect(() => {
    if (paid && address) {
      const socket = getSocket();

      socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('registerAccount', address);
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
        socket.close();  // Ensure the socket is closed on cleanup
      };
    }
  }, [paid, address]);  // Dependency on 'paid' to initialize the socket after payment

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setGameResult(null);
    setOpponent(null);
    setPaid(false);  // Reset payment on game restart
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden relative">
      {!gameStarted && !paid && (
        <button className="btn btn-primary" style={{ zIndex: 1000 }} onClick={() => handlePayment()}>
          Pay 0.02 ETH to play the game
        </button>
      )}
      {paid && (
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
        </div>
      )}
      <canvas ref={canvasRef} id="board" className="w-full h-full fixed top-0 left-0" />
    </div>
  );
}
