import { useQuery } from '@tanstack/react-query';
import { ConcreteBlockClass } from '@/parser/setup/Base';
import { parseTemplate } from '@/parser';
import { EmailScribeConfigProps } from '@/EmailScribe';

const fetchTemplate = async (
  templateId: string,
  TEMPLATE_ENDPOINT: string
): Promise<string> => {
  const response = await fetch(TEMPLATE_ENDPOINT + `/${templateId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching template: ${response.statusText}`);
  }
  return response.text();
};

const processTemplate = async (
  templateId: string,
  config: EmailScribeConfigProps
): Promise<ConcreteBlockClass[]> => {
  const TEMPLATE_ENDPOINT = `${config.apiUrl}/${config.basePath}/templates`;
  const templateContent = await fetchTemplate(templateId, TEMPLATE_ENDPOINT);
  return parseTemplate(templateContent, templateId, config);
};

export const useTemplate = (
  templateId: string,
  config: EmailScribeConfigProps
) => {
  return useQuery<ConcreteBlockClass[], Error>({
    queryKey: ['template', templateId],
    queryFn: () => processTemplate(templateId, config),
    enabled: !!templateId,
  });
};

export const useTemplates = (
  templateIds: string[],
  config: EmailScribeConfigProps
) => {
  return useQuery<ConcreteBlockClass[][], Error>({
    queryKey: ['templates', ...templateIds],
    queryFn: async () => {
      const templatePromises = templateIds.map((id) =>
        processTemplate(id, config)
      );
      const templates = await Promise.all(templatePromises);
      return templates;
    },
    enabled: templateIds.length > 0,
  });
};

export const useTemplateManager = (config: EmailScribeConfigProps) => {
  const templateIds = config.templatesToFetch || [];
  const singleTemplateQuery = useTemplate(templateIds[0] || '', config);

  const multipleTemplateQuery = useTemplates(templateIds || [], config);

  return {
    singleTemplateQuery,
    multipleTemplateQuery,
  };
};
