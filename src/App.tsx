import { EmailScribe, PresetMode } from '@/EmailScribe';
import { Save } from 'lucide-react';

function App() {
  return (
    <EmailScribe
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={import.meta.env.VITE_TEMPLATE_ID.split(',')}
      // iconComponent={<Pencil size={48} style={{ marginBottom: '0.5rem' }} />}
      // title='Email Designer'
      ctaOne={{
        label: 'Save',
        icon: <Save />,
        action: (subject, id, plainText, html) => {
          console.log('Save', subject, id, plainText, html);
        },
        hidden: false,
      }}
      ctaTwo={{ hidden: true }}
      presetMode={PresetMode.RemoteOnly}
    />
  );
}

export default App;
