import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const isAndroid = Platform.OS === 'android';

  const primaryColor = currentUser && currentUser.status === 'contractor' ? '#01AD94' : '#9E41F0';
  const secondaryColor = currentUser && currentUser.status === 'contractor' ? '#9E41F0' : '#01AD94';

  const theme = {
    primary: isAndroid ? shadeColor(primaryColor, -10) : primaryColor,
    secondary: isAndroid ? shadeColor(secondaryColor, -10) : secondaryColor,
    tertiary: isAndroid ? shadeColor('#4C7BC0', -10) : '#4C7BC0',
    lightPrimary: isAndroid ? shadeColor('#7B5BDC', -10) : '#7B5BDC',
    lightSecondary: isAndroid ? shadeColor('#01AD95', -10) : '#01AD95',
    drawerColorPrimary: isAndroid ? shadeColor(primaryColor, -10) : primaryColor,
    drawerColorSecondary: isAndroid ? shadeColor(secondaryColor, -10) : secondaryColor,
    gray: '#7B7B7B',
    background: '#FBFBFB',
    text: '#000',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

function shadeColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 255) + amt;
  const B = (num & 255) + amt;
  return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}


// LOG  {"background": "#FBFBFB", "black": "#000000", "drawerColorPrimary": "#9E41F0", "drawerColorSecondary": "#01AD94", "gray": "#7B7B7B", "lightPrimary": "#7B5BDC", "lightSecondary": "#01AD95", "primary": "#9E41F0", "secondary": "#01AD94", "tertiary": "#4C7BC0", "text": "#000", "transparent": "transparent", "white": "#FFFFFF"}


