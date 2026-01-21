import { useEffect, useRef, useState } from "react";
import Cube from "./cube";

const BOARD_SIZE = 800;
const CUBE_SIZE = 100;

type CubeData = {
  id: number;
  x: number;
  y: number;
};

function isColliding(a: CubeData, b: CubeData) {
  return (
    a.x < b.x + CUBE_SIZE &&
    a.x + CUBE_SIZE > b.x &&
    a.y < b.y + CUBE_SIZE &&
    a.y + CUBE_SIZE > b.y
  );
}

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const [cubes, setCubes] = useState<CubeData[]>([
    { id: 1, x: 0, y: 0 },
    { id: 2, x: 300, y: 300 },
  ]);

  const [activeCubeId, setActiveCubeId] = useState<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    cubeId: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setActiveCubeId(cubeId);
  };

  useEffect(() => {
    if (activeCubeId === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();

      let x = e.clientX - boardRect.left - offsetRef.current.x;
      let y = e.clientY - boardRect.top - offsetRef.current.y;

      // границы доски
      x = Math.max(0, Math.min(x, BOARD_SIZE - CUBE_SIZE));
      y = Math.max(0, Math.min(y, BOARD_SIZE - CUBE_SIZE));

      setCubes((prev) => {
        const next = prev.map((cube) =>
          cube.id === activeCubeId ? { ...cube, x, y } : cube,
        );

        const active = next.find((c) => c.id === activeCubeId)!;

        // проверка коллизий
        for (const cube of next) {
          if (cube.id !== activeCubeId && isColliding(active, cube)) {
            return prev; // отменяем движение
          }
        }

        return next;
      });
    };

    const handleMouseUp = () => setActiveCubeId(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeCubeId]);

  return (
    <div
      ref={boardRef}
      className="
          relative
          w-[800px] h-[800px]
          border-2 border-zinc-700
          bg-secondary
          select-none
        "
    >
      {cubes.map((cube) => (
        <Cube
          key={cube.id}
          posX={cube.x}
          posY={cube.y}
          onMouseDown={(e) => handleMouseDown(e, cube.id)}
          isActive={activeCubeId === cube.id}
        />
      ))}
    </div>
  );
}
