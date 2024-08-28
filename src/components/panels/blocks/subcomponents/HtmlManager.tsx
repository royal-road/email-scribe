import { Clipboard, Check, Save } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useState, useEffect } from 'react';
import { sanitizeHtml } from './utils/cleanHTML';
import { handleExportHtml } from './utils/importExport';

export default function HtmlManager({ getHtml }: { getHtml: () => string }) {
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
    handleExportHtml(sanitizeHtml(getHtml()));
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
      className='HtmlManager'
      style={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.5rem',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        alignItems: 'center',
        padding: '0.75rem',
        paddingTop: '1.25rem',
        flexWrap: 'wrap',
        paddingBottom: '0.75rem',

        marginBottom: '0',
      }}
    >
      <h6
        style={{
          margin: 0,
          flex: 1,
          lineHeight: '0.25rem',
          paddingTop: 0,
          paddingLeft: '0.35rem',
          paddingRight: '0.35rem',
          position: 'absolute',
          backgroundColor: 'var(--card)',
          top: '-0.125rem',
          left: '0.5rem',
        }}
      >
        HTML
      </h6>
      <div
        className='PresetManager'
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '0.25rem',
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
