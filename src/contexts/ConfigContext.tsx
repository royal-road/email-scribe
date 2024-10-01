import { EmailScribeConfigProps } from '@/EmailScribe';
import React, { createContext, useContext } from 'react';

type ConfigContextType = EmailScribeConfigProps & {
  containerRef?: React.RefObject<HTMLDivElement>;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{
  config: EmailScribeConfigProps;
  containerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}> = ({ config, children, containerRef }) => {
  return (
    <ConfigContext.Provider value={{ ...config, containerRef }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
