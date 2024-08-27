import { Clipboard, Check, Save } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useState, useEffect } from 'react';
import { sanitizeHtml } from './utils/cleanHTML';
import { handleExportHtml } from './utils/importExport';

export default function CopyToClip({ getHtml }: { getHtml: () => string }) {
  const [justCopied, setJustCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (justCopied) {
      timer = setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [justCopied]);

  const handleCopy = () => {
    setJustCopied(true);
    copyToClipboard(getHtml());
  };

  const handleDownload = () => {
    handleExportHtml(getHtml());
  };

  const copyToClipboard = (jsonState: string) => {
    if (jsonState === '') {
      navigator.clipboard.writeText('');
      return;
    }
    navigator.clipboard.writeText(sanitizeHtml(jsonState));
  };

  return (
    <div
      className='PresetManager'
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.5rem',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        alignItems: 'center',
        padding: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <h3 style={{ margin: 0, flex: 1, paddingTop: 0 }}>HTML</h3>
      <div
        className='PresetManager'
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '0.15rem',
          alignItems: 'center',
        }}
      >
        <Button
          style={{ display: 'flex', gap: '0.5rem', width: '100%' }}
          variant='default'
          onClick={handleCopy}
        >
          {justCopied ? 'Copied!' : 'Copy to Clipboard'}
          {justCopied ? <Check /> : <Clipboard />}
        </Button>
        <Button
          style={{ display: 'flex', gap: '0.5rem', width: '100%' }}
          variant='default'
          onClick={handleDownload}
        >
          Download <Save />
        </Button>
      </div>
    </div>
  );
}
