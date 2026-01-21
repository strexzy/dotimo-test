import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";

type CubeProps = {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  posX: number;
  posY: number;
};

const Cube = ({ posX, posY, onMouseDown }: CubeProps) => {
  const [cubeColor, setCubeColor] = useState<string>("orange");

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onMouseDown={onMouseDown}
          className={`
            absolute
            w-25 h-25
            rounded-md
            cursor-grab
            active:cursor-grabbing
            transition-shadow
            shadow-md
          `}
          style={{
            transform: `translate(${posX}px, ${posY}px)`,
            backgroundColor: cubeColor,
          }}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setCubeColor("orange");
          }}
        >
          Orange
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setCubeColor("blue");
          }}
        >
          Blue
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setCubeColor("red");
          }}
        >
          Red
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Cube;
