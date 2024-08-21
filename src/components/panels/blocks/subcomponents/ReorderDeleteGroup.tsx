import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";

export interface Breakpoints {
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}

export default function ReorderDeleteGroup({
  onUp,
  onDown,
  onDelete,
}: Breakpoints) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDelete = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
      onDelete();
    } else {
      setConfirmDelete(true);
      setTimeout(() => {
        setConfirmDelete(false);
      }, 4000);
    }
  };

  useEffect(() => {
    setConfirmDelete(false);
  }, []);

  return (
    <div className="BreakpointToggleGroup">
      <Button
        title="Move this block up"
        variant="outline"
        onClick={() => onUp()}
        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        size="icon"
      >
        <ArrowUp
          className=""
          style={{ marginRight: "0.125rem", marginLeft: "0.125rem" }}
        />
      </Button>
      <Button
        title="Move this block down"
        variant="outline"
        onClick={() => onDown()}
        style={{ borderRadius: 0 }}
        size="icon"
      >
        <ArrowDown
          style={{
            marginRight: "0.125rem",
            marginLeft: "0.125rem",
          }}
        />
      </Button>
      <Button
        title="Press twice to delete."
        variant={`${confirmDelete ? "destructive" : "outline"}`}
        onClick={() => handleDelete()}
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
        size="icon"
      >
        <X style={{ marginRight: "0.125rem", marginLeft: "0.125rem" }} />
      </Button>
    </div>
  );
}
