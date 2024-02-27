import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

const TwoSelectButtonGradient = ({ onPressPrimary, onPressSecondary, primary, secondary }) => {
  const [buttonType, setButtonType] = useState(primary)
  const theme = useTheme();
  const styles = getStyles(theme);
  
  const primaryPress = () => {
    setButtonType(primary)
    onPressPrimary()
  }

  const secondaryPress = () => {
    setButtonType(secondary)
    onPressSecondary()
  }
  
  // Function to render button with conditional gradient
  const renderButton = (label, isActive, onPress) => {
    const gradientColors = isActive ? [theme.primary, theme.secondary] : [theme.background, theme.background];
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.5, y: 0 }}
          style={styles.gradientWrapper}
        >
          <Text style={isActive ? styles.activeText : styles.inActiveText}>
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonTypeBox]}>
        {renderButton(secondary, buttonType === secondary, secondaryPress)}
        {renderButton(primary, buttonType === primary, primaryPress)}
      </View>
    </View>
  )
}

export default TwoSelectButtonGradient

const getStyles = (theme) => StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  buttonTypeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.primary,
    overflow: 'hidden',
    width: '100%',
    height: 60,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  activeText: {
    color: theme.white,
    fontSize: 18,
  },
  inActiveText: {
    color: theme.text,
    fontSize: 18,
  },
  gradientWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
