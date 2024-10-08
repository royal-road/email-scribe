import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Preset } from '../managers/PresetManager';
import { EmailScribeConfigProps } from '@/EmailScribe';

const apiFetch = async (
  url: string,
  options?: RequestInit,
  shouldQuery: boolean = true
) => {
  if (!shouldQuery) {
    return;
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

// Fetch all presets (list)
export const usePresets = (
  PRESETS_ENDPOINT: string,
  shouldQuery: boolean = true
) => {
  return useQuery<string[]>({
    queryKey: ['presets'],
    queryFn: () => apiFetch(PRESETS_ENDPOINT, { method: 'GET' }, shouldQuery),
  });
};

// Fetch a single preset
export const usePreset = (presetName: string, PRESET_ENDPOINT: string) => {
  return useQuery<Preset>({
    queryKey: ['preset', presetName],
    queryFn: () =>
      apiFetch(
        `${PRESET_ENDPOINT}?presetName=${encodeURIComponent(presetName)}`
      ),
    enabled: !!presetName,
  });
};

export const useDeletePreset = (PRESET_ENDPOINT: string) => {
  const queryClient = useQueryClient();

  return useMutation<Preset, Error, string>({
    mutationFn: (presetName) =>
      apiFetch(
        `${PRESET_ENDPOINT}?presetName=${encodeURIComponent(presetName)}`,
        {
          method: 'DELETE',
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
};

// Save a preset
export const useSavePreset = (PRESET_ENDPOINT: string) => {
  const queryClient = useQueryClient();

  return useMutation<Preset, Error, Preset>({
    mutationFn: (preset) =>
      apiFetch(PRESET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preset),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      queryClient.setQueryData(['preset', data.presetName], data);
    },
  });
};

// Custom hook to manage presets
// Custom hook to manage presets
export const usePresetManager = (
  config: EmailScribeConfigProps,
  shouldQuery: boolean = true
) => {
  const PRESETS_ENDPOINT = `${config.apiUrl}/${config.basePath}/presets`;
  const PRESET_ENDPOINT = `${config.apiUrl}/${config.basePath}/preset`;
  const presetsQuery = usePresets(PRESETS_ENDPOINT, shouldQuery);
  const savePreset = useSavePreset(PRESET_ENDPOINT);
  const deletePreset = useDeletePreset(PRESET_ENDPOINT);

  return {
    presetsQuery,
    usePreset,
    savePreset,
    deletePreset,
    presetEndpoint: PRESET_ENDPOINT,
  };
};
