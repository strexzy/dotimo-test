import { useEffect, useRef, useState } from "react";
import { BOARD_SIZE, CUBE_SIZE } from "@/lib";
import { Button } from "../ui/button";
import type { ConnectedPair, CubeData } from "./board.types";
import Cube from "./cube";

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

  const [connectedPair, setConnectedPair] = useState<ConnectedPair | null>(
    null,
  );
  const [activeCubeId, setActiveCubeId] = useState<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const disconnectAnimationRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    cubeId: number,
  ) => {
    if (disconnectAnimationRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setActiveCubeId(cubeId);
  };

  const getBoundsForPair = (cubes: CubeData[], pair: ConnectedPair) => {
    const cube1 = cubes.find((c) => c.id === pair.id1);
    const cube2 = cubes.find((c) => c.id === pair.id2);

    if (!cube1 || !cube2) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    const minX = Math.min(cube1.x, cube2.x);
    const minY = Math.min(cube1.y, cube2.y);
    const maxX = Math.max(cube1.x + CUBE_SIZE, cube2.x + CUBE_SIZE);
    const maxY = Math.max(cube1.y + CUBE_SIZE, cube2.y + CUBE_SIZE);

    return { minX, minY, maxX, maxY };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <getBoundsForPair changes on every re-render and should not be used as a hook dependency.>
  useEffect(() => {
    if (activeCubeId === null || disconnectAnimationRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();

      const x = e.clientX - boardRect.left - offsetRef.current.x;
      const y = e.clientY - boardRect.top - offsetRef.current.y;

      setCubes((prev) => {
        const next = [...prev];
        const activeIndex = next.findIndex((c) => c.id === activeCubeId);
        if (activeIndex === -1) return prev;

        const oldX = next[activeIndex].x;
        const oldY = next[activeIndex].y;

        next[activeIndex] = { ...next[activeIndex], x, y };

        if (connectedPair) {
          // Если кубы соединены, вычисляем смещение и применяем к другому кубу
          const otherId =
            connectedPair.id1 === activeCubeId
              ? connectedPair.id2
              : connectedPair.id1;
          const otherIndex = next.findIndex((c) => c.id === otherId);
          if (otherIndex === -1) return prev;

          const dx = x - oldX;
          const dy = y - oldY;
          next[otherIndex] = {
            ...next[otherIndex],
            x: next[otherIndex].x + dx,
            y: next[otherIndex].y + dy,
          };

          // Вычисляем границы связанной фигуры
          const bounds = getBoundsForPair(next, connectedPair);

          // Проверяем, не выходит ли связка за границы доски
          if (
            bounds.minX < 0 ||
            bounds.minY < 0 ||
            bounds.maxX > BOARD_SIZE ||
            bounds.maxY > BOARD_SIZE
          ) {
            // Откатываем изменения
            next[activeIndex].x = oldX;
            next[activeIndex].y = oldY;
            next[otherIndex].x = next[otherIndex].x - dx;
            next[otherIndex].y = next[otherIndex].y - dy;
          }
        } else {
          // Если не соединены просто проверяем границы активного куба
          if (
            x < 0 ||
            x > BOARD_SIZE - CUBE_SIZE ||
            y < 0 ||
            y > BOARD_SIZE - CUBE_SIZE
          ) {
            return prev;
          }

          // Проверяем столкновения
          const activeCube = next[activeIndex];
          for (const cube of next) {
            if (cube.id !== activeCubeId && isColliding(activeCube, cube)) {
              setConnectedPair({
                id1: activeCubeId,
                id2: cube.id,
              });
              break;
            }
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
  }, [activeCubeId, connectedPair]);

  const handleDisconnect = () => {
    if (!connectedPair) return;

    const id1 = connectedPair.id1;
    const id2 = connectedPair.id2;

    const interval = setInterval(() => {
      setCubes((prev) => {
        const next = [...prev];
        const index1 = next.findIndex((c) => c.id === id1);
        const index2 = next.findIndex((c) => c.id === id2);

        if (index1 === -1 || index2 === -1) {
          clearInterval(interval);
          if (disconnectAnimationRef.current) {
            clearInterval(disconnectAnimationRef.current);
            disconnectAnimationRef.current = null;
          }
          return prev;
        }

        next[index1] = {
          ...next[index1],
          x: next[index1].x - 2,
          y: next[index1].y - 2,
        };
        next[index2] = {
          ...next[index2],
          x: next[index2].x + 2,
          y: next[index2].y + 2,
        };

        const outOfBounds = next.some(
          (c) =>
            c.x < 0 ||
            c.x > BOARD_SIZE - CUBE_SIZE ||
            c.y < 0 ||
            c.y > BOARD_SIZE - CUBE_SIZE,
        );

        if (outOfBounds) {
          clearInterval(interval);
          if (disconnectAnimationRef.current) {
            clearInterval(disconnectAnimationRef.current);
            disconnectAnimationRef.current = null;
          }
        }

        return next;
      });
    }, 16);

    disconnectAnimationRef.current = interval;

    setTimeout(() => {
      if (disconnectAnimationRef.current) {
        clearInterval(disconnectAnimationRef.current);
        disconnectAnimationRef.current = null;
      }
      setConnectedPair(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleDisconnect}
        disabled={!connectedPair || !!disconnectAnimationRef.current}
        className="mb-4 bg-red-500 disabled:bg-primary"
      >
        Разъединить
      </Button>

      <div
        ref={boardRef}
        className="
          relative
          w-200 h-200
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
    </div>
  );
}
