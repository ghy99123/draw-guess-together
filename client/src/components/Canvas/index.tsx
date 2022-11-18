import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useCanvasDraw from "../../hooks/useCanvasDraw";
import { Coordinate } from "../../types/gameType";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../types/ISocket";
import Countdown from "../Countdown/Countdown";
import "./style.css";

interface Props {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  roomId: string;
  isPainter: boolean;
}

const Canvas: React.FC<Props> = (props: Props) => {
  const { socket, roomId, isPainter } = props;
  const ref = useRef<HTMLCanvasElement>(null);

  const [isPainting, setIsPainting] = useState(false);
  const [mousePos, setMousePos] = useState<Coordinate | undefined>(undefined);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  // get the mouse position
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!ref.current) return;

    const canvas = ref.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const drawLocal = (
    mousePos: Coordinate,
    newMousePos: Coordinate,
    color: CanvasFillStrokeStyles["strokeStyle"],
    lineWidth: number
  ) => {
    if (!ref.current) return;

    const canvas = ref.current;
    const context = canvas.getContext("2d");

    if (context) {
      context.strokeStyle = color;
      context.lineJoin = "round";
      context.lineWidth = lineWidth;

      context.beginPath();
      context.moveTo(mousePos.x, mousePos.y);
      context.lineTo(newMousePos.x, newMousePos.y);
      context.closePath();

      context.stroke();
    }
  };

  if (socket) {
    socket.on("draw", (mousePos, newMousePos, color, lineWidth) => {
      console.log("receive");
      drawLocal(mousePos, newMousePos, color, lineWidth);
    });
  }

  const drawLine = (
    mousePos: Coordinate,
    newMousePos: Coordinate,
    color: CanvasFillStrokeStyles["strokeStyle"],
    lineWidth: number
  ) => {
    drawLocal(mousePos, newMousePos, color, lineWidth);
    if (socket) {
      console.log("send");
      socket.emit("draw", mousePos, newMousePos, color, lineWidth, roomId);
    }
  };

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePos(coordinates);
    }
  }, []);

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePos = getCoordinates(event);
        if (mousePos && newMousePos) {
          drawLine(mousePos, newMousePos, color, lineWidth);
          setMousePos(newMousePos);
        }
      }
    },
    [isPainting, mousePos]
  );

  const cancelPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  useEffect(() => {
    if (!ref.current || !isPainter) return;

    const canvas: HTMLCanvasElement = ref.current;
    canvas.addEventListener("mousedown", startPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    };
  }, [startPaint, ref]);

  // draw the line on mouse move
  useEffect(() => {
    if (!ref.current || !isPainter) return;

    const canvas = ref.current;
    canvas.addEventListener("mousemove", paint);
    return () => {
      canvas.removeEventListener("mousemove", paint);
    };
  }, [paint, ref]);

  // stop drawing on mouse release
  useEffect(() => {
    if (!ref.current || !isPainter) return;

    const canvas = ref.current;
    canvas.addEventListener("mouseup", cancelPaint);
    canvas.addEventListener("mouseleave", cancelPaint);
    return () => {
      canvas.removeEventListener("mouseup", cancelPaint);
      canvas.removeEventListener("mouseleave", cancelPaint);
    };
  }, [cancelPaint, ref]);

  return (
    <>
      <div className="countdown-container">
        <Countdown />
      </div>
      <canvas ref={ref} width={800} height={400} />
    </>
  );
};

export default Canvas;
