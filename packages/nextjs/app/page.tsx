"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, startGame } from "../components/flappyBird";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

export default function Home() {
  const { address } = useAccount();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameOverRef = useRef(gameOver);

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
        </div>
      )}
      <canvas ref={canvasRef} id="board" className="w-full h-full" />
    </div>
  );
}
