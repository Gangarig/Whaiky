import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
const GradientButton = ({ text, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.shadowContainer]}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.getStarted}>{text}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({

  shadowContainer: {
    width: 243,
    height: 48,
    borderRadius: 4,
    backgroundColor: theme.white,
    borderColor:theme.gray,
    borderWidth: .5,

  },
  button: {
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%', 
    borderWidth: .5,
  },
  getStarted: {
    color: theme.white,
    fontFamily: 'Montserrat-Bold, Helvetica',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
}

export default GradientButton;