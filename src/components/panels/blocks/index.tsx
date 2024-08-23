import { BlockRenderer } from "./subcomponents/BlockRenderer";
import { useState, useCallback, useRef, useEffect } from "react";
import { BlockType, BlockDataMap } from "../../../blocks/setup/Types";
import { BlockFactory } from "../../../blocks/setup/Factory";
import { BlockInterface } from "../../../blocks/setup/Types";
import debounce from "debounce";
import { ScrollArea } from "../../ui/scrollArea";
import { BlockSelector } from "./subcomponents/BlockSelector";
import autoAnimate from "@formkit/auto-animate";
import { BlockGlobalSettings } from "./subcomponents/BlockGlobalSettings";

export interface BlockState {
  instance: BlockInterface<BlockType>;
  data: BlockDataMap[BlockType];
  cachedHtml: string;
}

interface BlockPanelProps {
  onUpdateFinalHtml: (html: string) => void;
}

export const BlocksPanel: React.FC<BlockPanelProps> = ({
  onUpdateFinalHtml,
}) => {
  const [blocks, setBlocks] = useState<BlockState[]>([]);
  const [scaffoldSettings, setScaffoldSettings] = useState<BlockState>(() => {
    const instance = BlockFactory.createBlock(BlockType.Scaffolding);
    return {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(),
    };
  });

  const animateParent = useRef(null);

  const updateRenderedHtml = () => {
    const blockContent: string[] = [];
    blocks.map((block) => blockContent.push(block.cachedHtml));
    const finHtml = blockContent.join("");
    scaffoldSettings.instance.updateFormData({
      ...scaffoldSettings.data,
      blocks: finHtml,
    });
    onUpdateFinalHtml(scaffoldSettings.instance.generateHTML());
  };

  useEffect(() => {
    updateRenderedHtml();
  }, [blocks, scaffoldSettings]);

  const debouncedSetScaffoldSettings = useCallback(
    debounce((newSettings) => {
      setScaffoldSettings(newSettings);
    }, 300),
    []
  );

  const updateBlockData = useCallback(
    debounce((index: number, newData: Partial<BlockDataMap[BlockType]>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block, i) => {
          if (i === index) {
            const updatedData = { ...block.data, ...newData };
            block.instance.updateFormData(updatedData);
            block.cachedHtml = block.instance.generateHTML(); // This ensures only the block that was updated is re-rendered
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
        cachedHtml: newBlockInstance.generateHTML(),
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
    // updateBlockData(index, {});
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    animateParent.current && autoAnimate(animateParent.current);
  }, [animateParent]);

  return (
    <div className="BlocksPanel">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "3rem",
          gap: "0.5rem",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2 className="PanelHeading">Newsletter Designer</h2>
        <BlockSelector addBlock={addBlock} />
        <BlockGlobalSettings
          scaffoldSettings={scaffoldSettings}
          setScalfoldSettings={debouncedSetScaffoldSettings}
        />
      </div>
      <ScrollArea className="blocks">
        {blocks.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <p style={{ fontWeight: 200, fontSize: "1.4cqw" }}>
              Click the "+" button to add a block
            </p>
          </div>
        )}
        <div ref={animateParent}>
          {blocks.map((block, index) => (
            <BlockRenderer
              isTop={index === 0}
              isBottom={index === blocks.length - 1}
              onDelete={() => removeBlock(index)}
              onUp={() => moveBlock(index, "up")}
              onDown={() => moveBlock(index, "down")}
              key={`block${block.instance.id}`}
              block={block.instance}
              data={block.data}
              onChange={(newData) => updateBlockData(index, newData)}
            />
          ))}
        </div>
      </ScrollArea>
      {/* <button onClick={() => addBlock(BlockType.Image)}>Add Image Block</button> */}
    </div>
  );
};
