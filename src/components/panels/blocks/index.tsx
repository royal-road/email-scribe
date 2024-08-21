import { BlockRenderer } from "./subcomponents/BlockRenderer";
import { useState, useCallback } from "react";
import { BlockType, BlockDataMap } from "../../../blocks/setup/Types";
import { BlockFactory } from "../../../blocks/setup/Factory";
import { BlockInterface } from "../../../blocks/setup/Types";
import debounce from "debounce";
import { Button } from "../../ui/button";
import { PlusCircle } from "lucide-react";

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

  return (
    <div className="BlocksPanel">
      <h2>Newsletter Designer</h2>
      <Button
        onClick={() => addBlock(BlockType.Scaffolding)}
        variant="ghost"
        size="icon"
      >
        <PlusCircle />
      </Button>
      <div className="blocks">
        {blocks.map((block, index) => (
          <BlockRenderer
            key={index}
            block={block.instance}
            data={block.data}
            onChange={(newData) => updateBlockData(index, newData)}
          />
        ))}
      </div>
      {/* <button onClick={() => addBlock(BlockType.Image)}>Add Image Block</button> */}
    </div>
  );
};
