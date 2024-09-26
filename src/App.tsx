import { EmailScribe, PresetMode } from '@/EmailScribe';
import { Save } from 'lucide-react';
import { presetTest } from '../server/public/testPreset';
function App() {
  return (
    <EmailScribe
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={import.meta.env.VITE_TEMPLATE_ID.split(',')}
      ctaOne={{
        label: 'Download Preset Json',
        icon: <Save />,
        action: (subject, id, plainText, html, preset) => {
          stringtoJsonDownload(preset, 'preset.json');
        },
        hidden: false,
      }}
      ctaTwo={{ hidden: true }}
      presetMode={PresetMode.Default}
      preloadPreset={JSON.stringify(presetTest)}
      nonce='123'
    />
  );
}

function stringtoJsonDownload(data: string, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = filename;
  a.click();
}

export default App;
