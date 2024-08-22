import { BlockMetadata, BlockType } from "./setup/Types";
import { BaseBlock } from "./setup/Base";
import { templatify } from "./utils/templater";

export interface HeaderBlockData {
  title: string;
  backgroundColor: string;
}

const meta: BlockMetadata = {
  label: "Header",
  thumbnailUrl: "/images/200x150.webp",
  description: "Coolest of all headers",
  tags: ["Header", "RR"],
  group: "Header",
};

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    backgroundColor: { type: "string" },
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
};

const defaultValues: HeaderBlockData = {
  title: "",
  backgroundColor: "#ffffff",
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

export class HeaderBlock extends BaseBlock<BlockType.Header> {
  constructor() {
    super(BlockType.Header, {
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
