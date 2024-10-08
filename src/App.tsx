import { EmailScribe, PresetMode } from '@/EmailScribe';
import { Save } from 'lucide-react';
import { presetTest } from '../server/public/testPreset';
function App() {
  return (
    <EmailScribe
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={[
        'All-in-one',
        'Checkout',
        'Notification-01',
        'Notification-02',
        'Notification-03',
        'Notification-04',
        'Notification-05',
        'Notification-06',
        'Notification-07',
        'Notification-08',
        'Notification-09',
        'Notification-10',
        'Notification-11',
        'Notification-12',
        'Notification-13',
        'Notification-14',
        'Notification-15',
        'Promotion-01',
        'Promotion-02',
        'Promotion-03',
        'Promotion-04',
        'Main-Container',
        'Invite',
        'Container',
      ]}
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
      scribeId='scribeA'
      ABTestMode='B'
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
