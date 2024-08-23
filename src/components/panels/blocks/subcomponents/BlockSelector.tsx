import { Button } from "../../../ui/button";
import { PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import BlockMeta from "../subcomponents/BlockMeta";
import { ScrollArea } from "../../../ui/scrollArea";
import { BlockFactory } from "../../../../blocks/setup/Factory";
import { BlockType } from "../../../../blocks/setup/Types";
import React from "react";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";
import { camelToTitleCase } from "../../../../../lib/utils";

interface BlockSelectorProps {
  addBlock: (type: BlockType) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ addBlock }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        side={isMobile ? "bottom" : "right"}
        style={{
          width: `${isMobile ? "85vw" : "50vw"}`,
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
        className="BlockSelector"
      >
        <h3 style={{ margin: "0" }}>Add Block</h3>
        <ScrollArea
          style={{
            width: "100%",
            height: "100%",

            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "start",
              alignItems: "center",
              height: "100%",
              gap: "1rem",
            }}
          >
            {Object.keys(BlockType)
              .filter(
                (key) =>
                  key != camelToTitleCase(BlockType.Scaffolding.toString())
              ) // Don't show the scaffolding block (Title case coz the key is in title case where defined)
              ?.map((key, index) => {
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
                      {...BlockFactory.getClassForBlockType(
                        blockType
                      ).getMeta()}
                    />
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
