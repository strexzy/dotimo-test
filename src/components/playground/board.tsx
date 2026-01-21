import { useEffect, useRef, useState } from "react";
import Cube from "./cube";

const BOARD_SIZE = 800;
const CUBE_SIZE = 100;

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();

      let x = e.clientX - boardRect.left - offsetRef.current.x;
      let y = e.clientY - boardRect.top - offsetRef.current.y;

      x = Math.max(0, Math.min(x, BOARD_SIZE - CUBE_SIZE));
      y = Math.max(0, Math.min(y, BOARD_SIZE - CUBE_SIZE));

      setPosition({ x, y });
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      <div
        ref={boardRef}
        className="
          relative
          w-200 h-200
          border-2 border-zinc-700
          bg-primary
          select-none
        "
      >
        <Cube
          onMouseDown={handleMouseDown}
          posX={position.x}
          posY={position.y}
        />
      </div>
    </>
  );
}
