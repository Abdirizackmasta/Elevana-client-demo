import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const SettingsContext = createContext(null);

const defaultSettings = {
  siteName: 'Elevana Hub',
  tagline: 'Skills That Move You Forward',
  logo: '/brand/logo-horizontal.png',
  contactEmail: 'hello@elevanahub.co.ke',
  contactPhone: '+254707523731',
  address: 'Nairobi, Kenya',
  social: {}
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => setSettings(data.settings))
      .catch(() => setSettings(defaultSettings));
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
