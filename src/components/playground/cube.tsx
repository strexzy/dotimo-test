import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type CubeProps = {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  posX: number;
  posY: number;
  isActive: boolean;
};

const Cube = ({ posX, posY, onMouseDown, isActive }: CubeProps) => {
  const [cubeColor, setCubeColor] = useState<string>("orange");

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
        <div
          onMouseDown={onMouseDown}
          className={`
            absolute
            w-25 h-25
            rounded-md
            cursor-grab
            active:cursor-grabbing
            transition-shadow
            ${isActive && " border-2 border-accent-foreground border-dashed"}
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
