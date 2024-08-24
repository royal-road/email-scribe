import React, { useCallback } from "react";
import { WidgetProps } from "@rjsf/utils";

export const FileUploadWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, options } = props;

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      // Add width to formData if it exists in options
      if (options && options.width) {
        formData.append("width", options.width.toString());
      }

      try {
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const data = await response.json();
        onChange(data.url);
      } catch (error) {
        console.error("Error uploading file:", error);
        // You might want to show an error message to the user here
      }
    },
    [onChange, options]
  );

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        accept={(options.accept as string) || "image/*"}
      />
      {props.value && (
        <div>
          <p>Uploaded file: {props.value}</p>
          <img
            src={props.value}
            alt="Uploaded file"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </div>
  );
};
