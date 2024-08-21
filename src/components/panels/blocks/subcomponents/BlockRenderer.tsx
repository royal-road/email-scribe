import { useState } from "react";
import {
  BlockDataMap,
  BlockInterface,
  BlockType,
} from "../../../../blocks/setup/Types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import { Button } from "../../../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

interface BlockRendererProps {
  block: BlockInterface<BlockType>;
  data: BlockDataMap[BlockType];
  onChange: (newData: Partial<BlockDataMap[BlockType]>) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  data,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="collapsibleTrigger CollapsibleRepository">
        <span>{block.type} Block</span>
        <CollapsibleTrigger asChild>
          <Button variant="outline">
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CollapsibleTrigger>
      </div>
      {/* This is where the stuff I want to pre-display goes */}
      <CollapsibleContent>
        {/* This css class comes from Collapsible's own styles.scss*/}
        <div className="CollapsibleRepository">
          <Form
            schema={block.schema}
            uiSchema={block.uiSchema}
            formData={data}
            validator={validator}
            onChange={(e) => onChange(e.formData)}
            className="blockForm"
            children={true}
          ></Form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
