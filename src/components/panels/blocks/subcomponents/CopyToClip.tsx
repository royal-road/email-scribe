import { Clipboard, Check } from "lucide-react";
import { Button } from "../../../ui/button";
import { useState, useEffect } from "react";

export default function CopyToClip({ onClick }: { onClick: () => void }) {
  const [justCopied, setJustCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (justCopied) {
      timer = setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [justCopied]);

  const handleClick = () => {
    setJustCopied(true);
    onClick();
  };

  return (
    <Button
      style={{ width: "100%", display: "flex", gap: "0.5rem" }}
      variant="default"
      onClick={handleClick}
    >
      <h2 style={{ fontSize: "1.2rem", fontWeight: "400" }}>
        {justCopied ? "Copied!" : "Copy to Clipboard"}
      </h2>
      {justCopied ? (
        <Check style={{ strokeWidth: "1px" }} />
      ) : (
        <Clipboard style={{ strokeWidth: "1px" }} />
      )}
    </Button>
  );
}
