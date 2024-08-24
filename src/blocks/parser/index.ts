import { BlockInterface } from "../setup/Types";

async function getModules(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`${error}`);
  }
}

function parseTemplate(content: string) {
  const parser = new DOMParser();
  try {
    const dom = parser.parseFromString(content, "text/html");
    const fin: BlockInterface[] = [];
    (dom.body.querySelectorAll("[data-module]") as NodeListOf<Element>).forEach(
      (node) => {
        fin.push(parseModule(node));
      }
    );
    return fin;
  } catch (error) {
    throw new Error(`Error parsing file content: ${error}`);
  }
}

function parseModule(node: Element): BlockInterface {}

async function processTemplate(url: string): Promise<void> {
  try {
    const templateContent = await getModules(url);
    const parsedContent = parseTemplate(templateContent);
    console.log(parsedContent);
  } catch (error) {
    console.error(error);
  }
}

export async function templateHandler() {
  await processTemplate("http://localhost:8080/template");
}
