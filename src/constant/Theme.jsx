import { Platform } from "react-native";

const isAndroid = Platform.OS === 'android';

const UserTheme = {
  primary: isAndroid ? shadeColor('#9E41F0', -10) : '#9E41F0',
  lightPrimary: isAndroid ? shadeColor('#7B5BDC', -10) : '#7B5BDC',
  secondary: isAndroid ? shadeColor('#01AD94', -10) : '#01AD94',
  tertiary: isAndroid ? shadeColor('#4C7BC0', -10) : '#4C7BC0',
  querternary: isAndroid ? shadeColor('#423EE7', -10) : '#423EE7',
  lightSecondary: isAndroid ? shadeColor('#01AD95', -10) : '#01AD95',
  DrawerColorPrimary: isAndroid ? shadeColor('#9E41F0', -10) : '#9E41F0',
  DrawerColorSecondary: isAndroid ? shadeColor('#01AD94', -10) : '#01AD94',
  gray : '#7B7B7B',
  background: '#FBFBFB',
  text: '#000',
  white: '#FBFBFB',
  black: '#000',
  transparent: 'transparent',
};

// Function to adjust the color by a specified percentage
function shadeColor(color, percent) {
  var num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 255) + amt,
      B = (num & 255) + amt;
  return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}

export default UserTheme;
