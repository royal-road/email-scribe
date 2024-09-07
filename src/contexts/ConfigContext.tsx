import { EmailScribeConfigProps } from '@/EmailScribe';
import React, { createContext, useContext } from 'react';

const ConfigContext = createContext<EmailScribeConfigProps | undefined>(
  undefined
);

export const ConfigProvider: React.FC<{
  config: EmailScribeConfigProps;
  children: React.ReactNode;
}> = ({ config, children }) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
