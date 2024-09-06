import { BlockMetadata } from '../setup/Types';
import { BaseBlock } from '../setup/Base';
import { templatify } from '../utils/templater';
import { v4 as uuidv4 } from 'uuid';

const meta: BlockMetadata = {
  id: uuidv4(),
  label: 'Scaffolding',
  thumbnailUrl: '/images/scaffolding.png',
  description: 'Main structure for the email template',
  tags: ['scaffolding', 'layout'],
  group: 'layout',
};

const schema = {
  type: 'object',
  properties: {
    mainBgColor: { type: 'string' },
    fontFamily: { type: 'string' },
    textColor: { type: 'string' },
    linkColor: { type: 'string' },
    buttonColor: { type: 'string' },
    buttonTextColor: { type: 'string' },
    blocks: { type: 'string' },
  },
  required: [
    'mainBgColor',
    'fontFamily',
    'textColor',
    'linkColor',
    'buttonColor',
    'buttonTextColor',
    'blocks',
  ],
};

const uiSchema = {
  mainBgColor: {
    'ui:widget': 'color',
    'ui:title': 'Main Background Color',
  },
  fontFamily: {
    'ui:widget': 'text',
    'ui:title': 'Font Family',
  },
  textColor: {
    'ui:widget': 'color',
    'ui:title': 'Text Color',
  },
  linkColor: {
    'ui:widget': 'color',
    'ui:title': 'Link Color',
  },
  buttonColor: {
    'ui:widget': 'color',
    'ui:title': 'Button Color',
  },
  buttonTextColor: {
    'ui:widget': 'color',
    'ui:title': 'Button Text Color',
  },
  blocks: {
    'ui:widget': 'hidden',
  },
};

const defaultValues = {
  mainBgColor: '#eceff3',
  fontFamily: "'Open Sans', Arial, sans-serif",
  textColor: '#7f8c8d',
  linkColor: '#6ec8c7',
  buttonColor: '#6ec8c7',
  buttonTextColor: '#FFFFFF',
  blocks: '',
};

const htmlTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>*|MC:SUBJECT|*</title>
  <style type="text/css">
    .ReadMsgBody { width: 100%; background-color: {{{mainBgColor}}}; }
    .ExternalClass { width: 100%; background-color: {{{mainBgColor}}}; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    html { width: 100%; }
    body { -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0; }
    table { border-spacing: 0; table-layout: fixed; margin: 0 auto; }
    table table table { table-layout: auto; }
    .yshortcuts a { border-bottom: none !important; }
    img:hover { opacity: 0.9 !important; }
    a { color: {{{linkColor}}}; text-decoration: none; }
    .textbutton a { font-family: {{{fontFamily}}} !important;}
    .btn-link a { color:{{{buttonTextColor}}} !important;}

    /*Responsive*/
    @media only screen and (max-width: 640px) {
      body { margin: 0px; width: auto !important; font-family: {{{fontFamily}}} !important;}
      .table-inner { width: 90% !important;  max-width: 90%!important;}
      .table-full { width: 100%!important; max-width: 100%!important;}
    }

    @media only screen and (max-width: 479px) {
      body { width: auto !important; font-family: {{{fontFamily}}} !important;}
      .table-inner{ width: 90% !important;}
      .table-full { width: 100%!important; max-width: 100%!important;}
      /*gmail*/
      u + .body .full { width:100% !important; width:100vw !important;}
    }
  </style>
</head>

<body class="body">
  {{{blocks}}}
</body>
</html>
`;

export class ScaffoldingBlock extends BaseBlock {
  constructor() {
    super({
      schema: schema,
      uiSchema: uiSchema,
      defaultValues: defaultValues,
      meta: meta,
      defaultHtml: htmlTemplate,
    });
  }

  static override getMeta(): BlockMetadata {
    return meta;
  }

  generateHTML(): string {
    return templatify(htmlTemplate, this.formData);
  }
}
