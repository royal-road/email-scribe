import { EmailScribe } from '@/EmailScribe';

function App() {
  return (
    <EmailScribe
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={import.meta.env.VITE_TEMPLATE_ID.split(',')}
      // iconComponent={<Pencil size={48} style={{ marginBottom: '0.5rem' }} />}
      // title='Email Designer'
    />
  );
}

export default App;
