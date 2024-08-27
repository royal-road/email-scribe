import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Constants
const API_URL = import.meta.env.VITE_API_URL as string;
const PRESETS_ENDPOINT = `${API_URL}/presets`;
const PRESET_ENDPOINT = `${API_URL}/preset`;

// Types
interface Preset {
  presetName: string;
  data: string;
}

// Helper function for API calls
const apiFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

// Fetch all presets
export const usePresets = () => {
  return useQuery<string[]>({
    queryKey: ['presets'],
    queryFn: () => apiFetch(PRESETS_ENDPOINT),
  });
};

// Fetch a single preset
export const usePreset = (presetName: string) => {
  return useQuery<Preset>({
    queryKey: ['preset', presetName],
    queryFn: () =>
      apiFetch(
        `${PRESET_ENDPOINT}?presetName=${encodeURIComponent(presetName)}`
      ),
    enabled: !!presetName,
  });
};

// Save a preset
export const useSavePreset = () => {
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
export const usePresetManager = () => {
  const presetsQuery = usePresets();
  const savePreset = useSavePreset();

  return {
    presetsQuery,
    usePreset,
    savePreset,
  };
};
