import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { shadowStyle } from '../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
const PrimaryButton = ({
  text,
  onPress,

}) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <LinearGradient
    colors={['#9E41F0', '#4C7BC0']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.button,shadowStyle]}
    >
    <TouchableComponent onPress={onPress}>
      <View style={styles.button}>
        <Text style={[styles.text]}>{text}</Text>
      </View>
    </TouchableComponent>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center', 
    borderWidth: 1, 
    borderWidth: 1, 
    borderColor: '#3d3d3d',
    width:150,
    height:30,
    borderRadius: 5,
     
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PrimaryButton;
