import { BlockMetadata, BlockType } from "./setup/Types";
import { BaseBlock } from "./setup/Base";
import { templatify } from "./utils/templater";

export interface ScaffoldingBlockData {
  title: string;
  backgroundColor: string;
  content: string;
}

const meta: BlockMetadata = {
  label: "Scaffolding",
  thumbnailUrl: "/images/200x150.webp",
  description: "For scaffolding everything",
  tags: ["scaffolding", "layout"],
  group: "layout",
};

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    backgroundColor: { type: "string" },
    content: { type: "string" },
  },
  required: ["title", "backgroundColor", "content"],
};

const uiSchema = {
  title: {
    "ui:widget": "text",
    "ui:title": "Title",
  },
  backgroundColor: {
    "ui:widget": "color",
    "ui:title": "Background Color",
  },
  content: {
    "ui:widget": "textarea",
    "ui:title": "Content",
  },
};

const defaultValues: ScaffoldingBlockData = {
  title: "Enter your title here",
  backgroundColor: "#ffffff",
  content: "",
};

const htmlTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
    <style type="text/css">
      body {
        margin: 0;
      }
      table {
        border-spacing: 0;
      }
      td {
        padding: 0;
        border: 0;
      }
      img {
        border: 0;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: {{backgroundColor}};
        padding-bottom: 60px;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        }        
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
    </style>
  </head>
  <body>
    <center class="wrapper">
      {{content}}
      <!-- End Main Class -->
    </center>
    <!-- End Wrapper -->
  </body>
</html>
`;

export class ScaffoldingBlock extends BaseBlock<BlockType.Scaffolding> {
  constructor() {
    super(BlockType.Scaffolding, {
      schema: schema,
      uiSchema: uiSchema,
      defaultValues: defaultValues,
      meta: meta,
    });
  }

  static override getMeta(): BlockMetadata {
    return meta;
  }

  generateHTML(): string {
    return templatify(htmlTemplate, this.formData);
  }
}
