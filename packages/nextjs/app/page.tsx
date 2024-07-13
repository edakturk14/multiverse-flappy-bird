"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "~~/api/socket";
// Update with the correct path to your socket.ts file
import { startGame as startGameLogic } from "~~/components/flappyBird";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("players", (count: number) => {
      setPlayers(count);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("players");
    };
  }, []);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const startGame = () => {
    startGameLogic(canvasRef, setGameStarted, setGameOver, gameOverRef);
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <div className="absolute top-0 left-0 m-4 flex items-center">
        <div className={`w-6 h-6 rounded-full ${players > 1 ? "bg-green-500" : "bg-red-500"}`}></div>
        <p className="ml-2">
          {players} {players === 1 ? "player" : "players"} online
        </p>
      </div>
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <button onClick={startGame} className="bg-white text-blue-500 font-bold py-2 px-4 rounded mt-4 text-xl">
            Start Game
          </button>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <span className="text-white text-6xl font-bold mb-8">GAME OVER</span>
          <button onClick={restartGame} className="bg-white text-blue-500 font-bold py-2 px-4 rounded mt-4 text-xl">
            Home
          </button>
        </div>
      )}
      <canvas ref={canvasRef} id="board" />
    </div>
  );
}
