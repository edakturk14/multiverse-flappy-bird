import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const getSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
  if (!socket) {
    socket = io(); // Automatically connects to the same server that serves the page
  }
  return socket;
};

export function startGame(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  gameOverRef: React.MutableRefObject<boolean>,
) {
  const socket = getSocket();
  startGameLogic(canvasRef, setGameStarted, setGameOver, gameOverRef, socket);
}

function startGameLogic(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  gameOverRef: React.MutableRefObject<boolean>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) {
  const canvas = canvasRef.current;
  if (canvas) {
    const context = canvas.getContext("2d");
    if (!context) return;

    const boardWidth = 1000;
    const boardHeight = 640;

    // bird
    const birdWidth = 34; // width/height ratio = 408/228 = 17/12
    const birdHeight = 24;
    const birdX = boardWidth / 8;
    const birdY = boardHeight / 2;

    const bird = {
      x: birdX,
      y: birdY,
      width: birdWidth,
      height: birdHeight,
    };

    const otherBird = { x: birdX, y: birdY, width: birdWidth, height: birdHeight };

    // pipes
    let pipeArray: any[] = [];
    const pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
    const pipeHeight = 512;
    const pipeX = boardWidth;
    const pipeY = 0;

    const birdImg = new Image();
    birdImg.src = "/images/flappybird.png";

    const topPipeImg = new Image();
    topPipeImg.src = "/images/toppipe.png";

    const bottomPipeImg = new Image();
    bottomPipeImg.src = "/images/bottompipe.png";

    // physics
    const velocityX = -2; // pipes moving left speed
    let velocityY = 0; // bird jump speed
    const gravity = 0.2;

    const update = () => {
      if (gameOverRef.current) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      velocityY += gravity;
      bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit the bird.y to top of the canvas

      if (bird.y >= canvas.height || bird.y <= 0) {
        setGameOver(true);
        gameOverRef.current = true;
        socket.emit("playerLost");
        return;
      }

      context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
      context.drawImage(birdImg, otherBird.x, otherBird.y, otherBird.width, otherBird.height);

      for (let i = 0; i < pipeArray.length; i++) {
        const pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (detectCollision(bird, pipe)) {
          setGameOver(true);
          gameOverRef.current = true;
          socket.emit("playerLost");
          return;
        }
      }

      while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // removes first element from the array
      }

      requestAnimationFrame(update);
    };

    const placePipes = () => {
      if (gameOverRef.current) return;

      const randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
      const openingSpace = boardHeight / 4;

      const topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      };
      pipeArray.push(topPipe);

      const bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      };
      pipeArray.push(bottomPipe);
    };

    const moveBird = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityY = -6;

        if (gameOverRef.current) {
          bird.y = birdY;
          pipeArray = [];
          setGameOver(false);
          gameOverRef.current = false;
        }

        // Send the bird's position to the server
        socket.emit("updateBird", bird);
      }
    };

    const detectCollision = (a: any, b: any) => {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    };

    socket.on("updateBird", (birdData: any) => {
      otherBird.x = birdData.x;
      otherBird.y = birdData.y;
    });

    canvas.height = boardHeight;
    canvas.width = boardWidth;

    birdImg.onload = () => {
      context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);

    return () => {
      document.removeEventListener("keydown", moveBird);
      socket.off("updateBird");
    };
  }
}
