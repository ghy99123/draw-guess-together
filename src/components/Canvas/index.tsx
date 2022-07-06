import React, { useRef } from "react";
import { io } from "socket.io-client";
import useCanvasDraw from "../../hooks/useCanvasDraw";

const socket = io("ws://localhost:7000");

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [setColor, setLineWidth] = useCanvasDraw(canvasRef, socket);
  return (
    <>
      <canvas ref={canvasRef} width={800} height={400} />
    </>
  );
}
