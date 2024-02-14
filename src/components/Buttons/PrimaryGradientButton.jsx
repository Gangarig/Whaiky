import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {shadowStyle} from '../../constant/Shadow';
import { useTheme } from '../../context/ThemeContext';

const PrimaryGradientButton = ({ text, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <TouchableComponent onPress={onPress}>
      <View style={[styles.shadowContainer]}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y:5 }}
          style={styles.button}
        >
          <Text style={styles.getStarted}>{text}</Text>
        </LinearGradient>
      </View>
    </TouchableComponent>
  );
}

const getStyles = (theme) => {
  return StyleSheet.create({
  shadowContainer: {
    width: 243,
    height: 48,
    borderRadius: 4,
    backgroundColor: theme.backgroundColor,
    borderColor:theme.gray,
    borderRadius: 4,
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
}
export default PrimaryGradientButton;
