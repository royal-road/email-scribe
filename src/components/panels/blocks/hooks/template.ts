import { useQuery } from '@tanstack/react-query';
import { ConcreteBlockClass } from '../../../../blocks/setup/Base';
import { parseTemplate } from '../../../../blocks/parser';

const API_URL = import.meta.env.VITE_API_URL as string;
const BASE_PATH = import.meta.env.VITE_BASE_PATH as string;
const TEMPLATE_ENDPOINT = `${API_URL}/${BASE_PATH}/templates`;

const fetchTemplate = async (templateId: string): Promise<string> => {
  console.log('fetching template', TEMPLATE_ENDPOINT + `/${templateId}`);
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

// Process a single template
const processTemplate = async (
  templateId: string
): Promise<ConcreteBlockClass[]> => {
  const templateContent = await fetchTemplate(templateId);
  return parseTemplate(templateContent, templateId);
};

// Hook for fetching and processing a single template
export const useTemplate = (templateId: string) => {
  return useQuery<ConcreteBlockClass[], Error>({
    queryKey: ['template', templateId],
    queryFn: () => processTemplate(templateId),
    enabled: !!templateId,
  });
};

// Hook for fetching and processing multiple templates
export const useTemplates = (templateIds: string[]) => {
  return useQuery<ConcreteBlockClass[][], Error>({
    queryKey: ['templates', ...templateIds],
    queryFn: async () => {
      const templatePromises = templateIds.map((id) => processTemplate(id));
      const templates = await Promise.all(templatePromises);
      return templates;
    },
    enabled: templateIds.length > 0,
  });
};

// Helper hook to manage all templates
export const useTemplateManager = (templateIds: string[] = []) => {
  const singleTemplateQuery = useTemplate(templateIds[0] || '');

  const multipleTemplateQuery = useTemplates(templateIds || []);

  return {
    singleTemplateQuery,
    multipleTemplateQuery,
  };
};
