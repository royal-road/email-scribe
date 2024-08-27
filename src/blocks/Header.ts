import { BlockMetadata } from './setup/Types';
import { BaseBlock } from './setup/Base';
import { templatify } from './utils/templater';
import { v4 as uuidv4 } from 'uuid';

const meta: BlockMetadata = {
  id: uuidv4(),
  label: 'Header',
  thumbnailUrl: '/thumbnails/main-1_header.png',
  description: 'Main header with logo, slogan, and call-to-action button',
  tags: ['header', 'logo', 'cta'],
  group: 'headers',
};

const schema = {
  type: 'object',
  properties: {
    mainBgColor: { type: 'string' },
    headerBgColor: { type: 'string' },
    headerBgImage: { type: 'string' },
    topLogoImage: { type: 'string' },
    slogan: { type: 'string' },
    sloganColor: { type: 'string' },
    sloganFontFamily: { type: 'string' },
    sloganFontSize: { type: 'string' },
    headerLogoImage: { type: 'string' },
    headerLogoWidth: { type: 'string' },
    dottedColor: { type: 'string' },
    subHeadline: { type: 'string' },
    subHeadlineColor: { type: 'string' },
    subHeadlineFontFamily: { type: 'string' },
    subHeadlineFontSize: { type: 'string' },
    buttonText: { type: 'string' },
    buttonBgColor: { type: 'string' },
    buttonTextColor: { type: 'string' },
    buttonFontFamily: { type: 'string' },
    buttonFontSize: { type: 'string' },
    buttonLink: { type: 'string' },
  },
  required: [
    'mainBgColor',
    'headerBgColor',
    'headerBgImage',
    'topLogoImage',
    'slogan',
    'sloganColor',
    'sloganFontFamily',
    'sloganFontSize',
    'headerLogoImage',
    'headerLogoWidth',
    'dottedColor',
    'subHeadline',
    'subHeadlineColor',
    'subHeadlineFontFamily',
    'subHeadlineFontSize',
    'buttonText',
    'buttonBgColor',
    'buttonTextColor',
    'buttonFontFamily',
    'buttonFontSize',
    'buttonLink',
  ],
};

const uiSchema = {
  mainBgColor: { 'ui:widget': 'hidden' },
  headerBgColor: { 'ui:widget': 'color' },
  headerBgImage: { 'ui:widget': 'file' },
  topLogoImage: { 'ui:widget': 'file' },
  slogan: { 'ui:widget': 'text' },
  sloganColor: { 'ui:widget': 'color' },
  sloganFontFamily: { 'ui:widget': 'hidden' },
  sloganFontSize: { 'ui:widget': 'hidden' },
  headerLogoImage: { 'ui:widget': 'file' },
  headerLogoWidth: { 'ui:widget': 'text' },
  dottedColor: { 'ui:widget': 'color' },
  subHeadline: { 'ui:widget': 'text' },
  subHeadlineColor: { 'ui:widget': 'color' },
  subHeadlineFontFamily: { 'ui:widget': 'hidden' },
  subHeadlineFontSize: { 'ui:widget': 'hidden' },
  buttonText: { 'ui:widget': 'text' },
  buttonBgColor: { 'ui:widget': 'color' },
  buttonTextColor: { 'ui:widget': 'color' },
  buttonFontFamily: { 'ui:widget': 'hidden' },
  buttonFontSize: { 'ui:widget': 'hidden' },
  buttonLink: { 'ui:widget': 'text' },
};

const defaultValues = {
  mainBgColor: '#eceff3',
  headerBgColor: '#262d32',
  headerBgImage: 'images/header-bg-1.png',
  topLogoImage: 'images/top-logo.png',
  slogan: 'The Creative Ecosystem',
  sloganColor: '#FFFFFF',
  sloganFontFamily: "'Open sans', Arial, sans-serif",
  sloganFontSize: '12px',
  headerLogoImage: 'images/header-logo.png',
  headerLogoWidth: '360',
  dottedColor: '#6ec8c7',
  subHeadline: 'Responsive Email Template',
  subHeadlineColor: '#FFFFFF',
  subHeadlineFontFamily: "'Times New Roman', Arial, sans-serif",
  subHeadlineFontSize: '16px',
  buttonText: 'Get 30 Days Trial',
  buttonBgColor: '#6ec8c7',
  buttonTextColor: '#FFFFFF',
  buttonFontFamily: "'Open sans', Arial, sans-serif",
  buttonFontSize: '14px',
  buttonLink: '#',
};

const htmlTemplate = `
<table data-thumb="main-1_header.png" data-module="main-1_header" data-bgcolor="Main BG" class="full" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center">
      <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td data-bgcolor="Header BG" data-bg="Header BG" align="center" background="{{headerBgImage}}" bgcolor="{{headerBgColor}}" style="background-size:cover; background-position:top;">
            <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td class="fade" align="center" style="background-color:rgba(0,0,0,0.2)">
                  <table border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="700" align="center">
                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
                              <!--bar logo-->
                              <div style="display:inline-block;vertical-align:top;">
                                <table class="table-full" align="center" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td width="180" align="center">
                                      <table class="fade" style="background-color:rgba(0,0,0,0.2)" width="50" border="0" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td width="23" height="55" align="center" style="line-height: 0px;">
                                            <img src="{{topLogoImage}}" alt="img" width="20" style="display:block; line-height:0px; font-size:0px; border:0px;" editable label="image" mc:edit="main-1-1" />
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--end bar logo-->
                              <!--[if (gte mso 9)|(IE)]>
                              </td>
                              <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
                              <![endif]-->
                              <div style="display:inline-block;vertical-align:top;">
                                <table class="table-full" align="center" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td width="250" align="center"></td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if (gte mso 9)|(IE)]>
                              </td>
                              <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
                              <![endif]-->
                              <!--menu-->
                              <div style="display:inline-block;vertical-align:top;">
                                <table align="center" width="0" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td width="270" align="center">
                                      <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td height="20"></td>
                                        </tr>
                                        <tr>
                                          <td data-link-style="text-decoration:none; color:{{sloganColor}};" data-link-color="Menu Link" data-color="Menu" data-size="Menu" mc:edit="main-1-2" align="center" style="text-decoration: none; color:{{sloganColor}};font-family: {{sloganFontFamily}};font-size:{{sloganFontSize}};">
                                            <singleline label="slogan">{{slogan}}</singleline>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td height="15"></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--end menu-->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0" class="table-inner">
              <tr>
                <td height="100"></td>
              </tr>
              <!--Header Logo-->
              <tr>
                <td align="center">
                  <table border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="line-height: 0px;">
                        <img src="{{headerLogoImage}}" alt="img" width="{{headerLogoWidth}}" style="display:block; line-height:0px; font-size:0px; border:0px;width: 100%;" editable label="image" mc:edit="main-1-3" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!--end Header Logo-->
              <tr>
                <td height="25"></td>
              </tr>
              <!--dotted-->
              <tr>
                <td align="center">
                  <table border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td data-bgcolor="Dotted" bgcolor="{{dottedColor}}" style="border-radius:5px;font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                      <td width="15"></td>
                      <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td data-bgcolor="Dotted" bgcolor="{{dottedColor}}" style="border-radius:5px;font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                      <td width="15"></td>
                      <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td data-bgcolor="Dotted" bgcolor="{{dottedColor}}" style="border-radius:5px;font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                      <td width="15"></td>
                      <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td data-bgcolor="Dotted" bgcolor="{{dottedColor}}" style="border-radius:5px;font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!--end dotted-->
              <tr>
                <td height="15"></td>
              </tr>
              <!--sub headline-->
              <tr>
                <td data-link-style="text-decoration:none; color:{{subHeadlineColor}};" data-link-color="SubHeadline Link" data-color="SubHeadline" data-size="SubHeadline" mc:edit="main-1-4" align="center" style="font-family: {{subHeadlineFontFamily}}; color:{{subHeadlineColor}}; font-size:{{subHeadlineFontSize}}; letter-spacing: 1px;line-height: 28px; font-style:italic;">
                  <singleline label="title">{{subHeadline}}</singleline>
                </td>
              </tr>
              <!--end sub headline-->
              <tr>
                <td height="30"></td>
              </tr>
              <!--button-->
              <tr>
                <td align="center">
                  <table class="textbutton" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td data-bgcolor="Button" data-link-style="text-decoration:none; color:{{buttonTextColor}};" data-link-color="Button Link" data-size="Button" mc:edit="main-1-5" bgcolor="{{buttonBgColor}}" height="45" align="center" style="border-radius:30px;font-family: {{buttonFontFamily}}; color:{{buttonTextColor}}; font-size:{{buttonFontSize}}; padding-left: 25px;padding-right: 25px; font-weight: bold;">
                        <a href="{{buttonLink}}" style="text-decoration: none; color:{{buttonTextColor}};" data-color="Button Link"><singleline label="button">{{buttonText}}</singleline></a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!--end button-->
              <tr>
                <td height="90"></td>
              </tr>
            </table>
          </td>
        </tr>
</table>
      </td>
    </tr>
  </table>`;

export class HeaderBlock extends BaseBlock {
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
