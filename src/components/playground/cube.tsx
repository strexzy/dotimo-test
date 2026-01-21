import { Card } from "@/components/ui/card";
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
};

const Cube = ({ posX, posY, onMouseDown }: CubeProps) => {
  return (
    <Card
      onMouseDown={onMouseDown}
      className="
            absolute
            w-12.5 h-12.5
            cursor-grab
            active:cursor-grabbing
            transition-shadow
            shadow-md
          "
      style={{
        transform: `translate(${posX}px, ${posY}px)`,
      }}
    />
  );
};

export default Cube;
