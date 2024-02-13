import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

const getShadedColor = (color, percent) => {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 255) + amt;
  const B = (num & 255) + amt;
  return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
};

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const isAndroid = Platform.OS === 'android';

  // Define themes
  const defaultTheme = {
    primary: '#9E41F0',
    secondary: '#01AD94',
    tertiary: '#4C7BC0',
    lightPrimary: '#dfd1f1',
    lightSecondary: '#01AD95',
    gray: '#7B7B7B',
    background: '#FBFBFB',
    backgroundSecondary: '#dfd1f1',
    text: '#000',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  };

  const contractorTheme = {
    primary: '#189DA2', 
    secondary: '#9E41F0',
    tertiary: '#457FBC',
    lightPrimary: '#d6eaeb',  
    lightSecondary: '#01AD95',
    querternary: '#01AD94',
    gray: '#7B7B7B',
    background: '#FBFBFB',
    backgroundSecondary: '#d6eaeb',
    text: '#000',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  };

  // Apply shading for Android platform
  const applyShading = (theme) => {
    const shadedTheme = { ...theme };
    Object.keys(shadedTheme).forEach(key => {
      if (typeof shadedTheme[key] === 'string' && shadedTheme[key].startsWith('#')) {
        shadedTheme[key] = isAndroid ? getShadedColor(shadedTheme[key], -10) : shadedTheme[key];
      }
    });
    return shadedTheme;
  };

  // Determine which theme to use
  const theme = currentUser && currentUser.status === 'contractor' ? applyShading(contractorTheme) : applyShading(defaultTheme);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
