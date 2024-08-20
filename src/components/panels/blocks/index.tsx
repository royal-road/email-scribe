import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/Collapsible";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "../../ui/Button";

export default function BlocksPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="BlocksPanel">
      <h2>Newsletter Designer</h2>

      <div className="blocks">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="collapsibleTrigger CollapsibleRepository">
            <span>Block A</span>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                {open ? <X /> : <ChevronsUpDown />}
              </Button>
            </CollapsibleTrigger>
          </div>
          {/* This is where the stuff I want to pre-display goes */}
          <CollapsibleContent>
            {/* This css class comes from Collapsible's own styles.scss*/}
            <div className="CollapsibleRepository">
              <span className="Text">Block A Option 1</span>
            </div>
            <div className="CollapsibleRepository">
              <span className="Text">Block B Option 2</span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
