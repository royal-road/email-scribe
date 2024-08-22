import { BlockRenderer } from "./subcomponents/BlockRenderer";
import { useState, useCallback } from "react";
import { BlockType, BlockDataMap } from "../../../blocks/setup/Types";
import { BlockFactory } from "../../../blocks/setup/Factory";
import { BlockInterface } from "../../../blocks/setup/Types";
import debounce from "debounce";
import { Button } from "../../ui/button";
import { PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ScrollArea } from "../../ui/scrollArea";
import BlockMeta from "./subcomponents/BlockMeta";

interface BlockState {
  instance: BlockInterface<BlockType>;
  data: BlockDataMap[BlockType];
}

interface BlockPanelProps {
  onUpdateFinalHtml: (html: string) => void;
}

export const BlocksPanel: React.FC<BlockPanelProps> = ({
  onUpdateFinalHtml,
}) => {
  const [blocks, setBlocks] = useState<BlockState[]>([]);

  const updateBlockData = useCallback(
    debounce((index: number, newData: Partial<BlockDataMap[BlockType]>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block, i) => {
          if (i === index) {
            const updatedData = { ...block.data, ...newData };
            block.instance.updateFormData(updatedData);
            onUpdateFinalHtml(block.instance.generateHTML());
            return { ...block, data: updatedData };
          }
          return block;
        })
      );
    }, 300),
    []
  );

  const addBlock = (type: BlockType) => {
    const newBlockInstance = BlockFactory.createBlock(type);
    setBlocks((prev) => [
      ...prev,
      {
        instance: newBlockInstance,
        data: newBlockInstance.formData,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    console.log("remove block", index);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 1);
      return newBlocks;
    });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    console.log("move block", index, direction);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const block = newBlocks[index];
      newBlocks.splice(index, 1);
      newBlocks.splice(direction === "up" ? index - 1 : index + 1, 0, block);
      return newBlocks;
    });
  };

  return (
    <div className="BlocksPanel">
      <h2>Newsletter Designer</h2>
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
        <PopoverContent>
          <Button asChild onClick={() => addBlock(BlockType.Scaffolding)}>
            <BlockMeta
              {...BlockFactory.getClassForBlockType(
                BlockType.Scaffolding
              ).getMeta()}
            />
          </Button>
        </PopoverContent>
      </Popover>
      <ScrollArea className="blocks">
        {blocks.map((block, index) => (
          <BlockRenderer
              isTop={index === 0}
            onDelete={() => removeBlock(index)}
            onUp={() => moveBlock(index, "up")}
            onDown={() => moveBlock(index, "down")}
            key={index}
            index={index}
            block={block.instance}
            data={block.data}
            onChange={(newData) => updateBlockData(index, newData)}
          />
        ))}
      </ScrollArea>
      {/* <button onClick={() => addBlock(BlockType.Image)}>Add Image Block</button> */}
    </div>
  );
};
