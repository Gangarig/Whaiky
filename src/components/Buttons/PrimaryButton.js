import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { shadowStyle } from '../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constant/Colors';

const PrimaryButton = ({
  text,
  onPress,

}) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (

    <TouchableComponent onPress={onPress}>
      <View style={[styles.button,shadowStyle]}>
        <Text style={[styles.text]}>{text}</Text>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center', 
    width:150,
    height:30,
    borderRadius: 5,
    backgroundColor: Colors.buttonBg,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
  },
});

export default PrimaryButton;
