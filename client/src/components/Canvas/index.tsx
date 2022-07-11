import React, { useRef } from "react";
import { io } from "socket.io-client";
import useCanvasDraw from "../../hooks/useCanvasDraw";
import Countdown from "../Countdown/Countdown";
import "./style.css";

const socket = io("ws://localhost:7000");

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [setColor, setLineWidth] = useCanvasDraw(canvasRef, socket);
  return (
    <>
      <div className="countdown-container">
        <Countdown />
      </div>
      <canvas ref={canvasRef} width={800} height={400} />
    </>
  );
}
