import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {shadowStyle} from '../../constant/Shadow';

const GradientButton = ({ text, onPress }) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <TouchableComponent onPress={onPress}>
      <View style={[styles.shadowContainer,shadowStyle]}>
        <LinearGradient
          colors={['rgb(158, 66, 240)', 'rgb(2, 173, 148)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.getStarted}>{text}</Text>
        </LinearGradient>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    width: 243,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderColor:'#ddd',
    borderRadius: 4,
    borderWidth: 1,

  },
  button: {
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Use '100%' to fill the shadow container width
    height: '100%', // Use '100%' to fill the shadow container height
    borderWidth: .5,
  },
  getStarted: {
    color: '#ffffff',
    fontFamily: 'Montserrat-Bold, Helvetica',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
});

export default GradientButton;
