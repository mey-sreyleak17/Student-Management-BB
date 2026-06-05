import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../Api/indext";

const SettingsContext =
  createContext();

export const SettingsProvider = ({
  children,
}) => {

  const [settings, setSettings] =
    useState(null);

  const getSettings = async () => {

    try {

      const res = await api.get(
        "/settings"
      );

      setSettings(
        res.data.settings
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (

    <SettingsContext.Provider
      value={{
        settings,
        getSettings,
      }}
    >

      {children}

    </SettingsContext.Provider>

  );
};

export const useSettings = () =>
  useContext(SettingsContext);