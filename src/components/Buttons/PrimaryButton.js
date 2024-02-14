import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { shadowStyle } from '../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
const PrimaryButton = ({ text, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (

    <TouchableOpacity onPress={onPress} style={[shadowStyle]}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.5, y: 4 }}
          style={[styles.button]}
        >
          <Text style={[styles.text]}>{text}</Text>
        </LinearGradient>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({

  button: {
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
    height:30,
    borderRadius: 5,
    backgroundColor: theme.primary,
    ...shadowStyle,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.white,
  },
});
}
export default PrimaryButton;
