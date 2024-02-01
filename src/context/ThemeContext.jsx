import React, { createContext, useContext, useMemo } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
function shadeColor(color, percent) {
  var num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 255) + amt,
      B = (num & 255) + amt;
  return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const isAndroid = Platform.OS === 'android';

  const theme = useMemo(() => {
    let primaryColor = '#9E41F0';
    let secondaryColor = '#01AD94';
    let tertiaryColor = '#4C7BC0';
    let lightPrimaryColor = '#7B5BDC';
    let lightSecondaryColor = '#01AD95';
    let drawerColorPrimary = '#9E41F0';
    let drawerColorSecondary = '#01AD94';
    let grayColor = '#7B7B7B';
    let backgroundColor = '#FBFBFB';
    let textColor = '#000';
    let whiteColor = '#FFFFFF';
    let blackColor = '#000000';
    let transparentColor = 'transparent';

    if (currentUser) {
      if (currentUser.status === 'contractor') {
        primaryColor = '#01AD94';
        secondaryColor = '#9E41F0';
        }
    //   } else if (currentUser.status === 'admin') {
    //     // primaryColor = '#ColorForAdmin';
    //     // secondaryColor = '#AnotherColorForAdmin';
    //     // // Changes for admin status
    //   }
      // Further adjustments can be made for different user statuses if required
    }

    return {
      primary: isAndroid ? shadeColor(primaryColor, -10) : primaryColor,
      secondary: isAndroid ? shadeColor(secondaryColor, -10) : secondaryColor,
      tertiary: isAndroid ? shadeColor(tertiaryColor, -10) : tertiaryColor,
      lightPrimary: isAndroid ? shadeColor(lightPrimaryColor, -10) : lightPrimaryColor,
      lightSecondary: isAndroid ? shadeColor(lightSecondaryColor, -10) : lightSecondaryColor,
      drawerColorPrimary: isAndroid ? shadeColor(drawerColorPrimary, -10) : drawerColorPrimary,
      drawerColorSecondary: isAndroid ? shadeColor(drawerColorSecondary, -10) : drawerColorSecondary,
      gray: grayColor,
      background: backgroundColor,
      text: textColor,
      white: whiteColor,
      black: blackColor,
      transparent: transparentColor,
    };
  }, [currentUser, isAndroid]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
