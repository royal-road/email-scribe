import { Button } from "../../../ui/button";
import { PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import BlockMeta from "../subcomponents/BlockMeta";
import { ScrollArea } from "../../../ui/scrollArea";
import { BlockFactory } from "../../../../blocks/setup/Factory";
import { BlockType } from "../../../../blocks/setup/Types";
import React from "react";

interface BlockSelectorProps {
  addBlock: (type: BlockType) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ addBlock }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          style={{
            padding: 0,
            minWidth: "3rem",
            maxWidth: "3rem",
            minHeight: "3rem",
            maxHeight: "3rem",
          }}
        >
          <PlusCircle />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        style={{ width: "50rem", display: "flex", gap: "1rem" }}
        className="BlockSelector"
      >
        <ScrollArea
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          {Object.keys(BlockType).map((key, index) => {
            const blockType = BlockType[key as keyof typeof BlockType];
            return (
              <div
                key={blockType}
                onClick={() => addBlock(blockType)}
                id={`blockMeta${index}`}
                style={{ width: "fit-content" }}
                className="BlockMetaClickable"
              >
                <BlockMeta
                  {...BlockFactory.getClassForBlockType(blockType).getMeta()}
                />
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
