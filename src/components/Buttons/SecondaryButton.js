import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { shadowStyle } from '../../constant/Shadow';
const SecondaryButton = ({
  text,
  onPress,
  color = '#adb5bd', // Default color can be overridden
  borderRadius = 5,
  paddingVertical = 10,
  paddingHorizontal = 20,
  textStyle = {},
  buttonStyle = {},
}) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <TouchableComponent onPress={onPress}>
      <View style={[styles.button, buttonStyle,shadowStyle, { backgroundColor: color, borderRadius, paddingVertical, paddingHorizontal }]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#3d3d3d',
    width:150,

     
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SecondaryButton;
