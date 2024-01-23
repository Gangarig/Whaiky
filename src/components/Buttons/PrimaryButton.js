import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { shadowStyle } from '../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import UserTheme from '../../constant/Theme';
const PrimaryButton = ({
  text,
  onPress,
}) => {
  return (

    <TouchableOpacity onPress={onPress} style={[shadowStyle]}>
        <LinearGradient
          colors={['#9E42F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button]}
        >
          <Text style={[styles.text]}>{text}</Text>
        </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
    height:30,
    borderRadius: 5,
    backgroundColor: UserTheme.primary,
    ...shadowStyle,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: UserTheme.white,
  },
});

export default PrimaryButton;
