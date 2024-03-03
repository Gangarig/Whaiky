import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Define themes
  const defaultTheme = {
    primary: '#9E41F0',
    secondary: '#189DA2',
    tertiary: '#4C7BC0',
    lightPrimary: '#dfd1f1',
    lightSecondary: '#01AD95',
    gray: '#7B7B7B',
    background: '#FBFBFB',
    backgroundSecondary: '#dfd1f1',
    text: '#090909',
    white: '#FFFFFF',
    black: '#090909',
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
    text: '#090909',
    white: '#FFFFFF',
    black: '#090909',
    transparent: 'transparent',
  };

  // Determine which theme to use
  const theme = ((currentUser && currentUser.status === 'contractor') ||(currentUser && currentUser.status ==='admin')) ? contractorTheme : defaultTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
