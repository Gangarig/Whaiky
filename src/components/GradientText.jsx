import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import UserTheme from '../constant/Theme';

const GradientText = ({ text, size, underline }) => {
  const fontSize = size || 20; 

  const renderText = () => {
    if (underline) {
      return (
        <Text style={[styles.GradientText, { fontSize }]}>
          <Text style={{ textDecorationLine: 'underline' }}>{text}</Text>
        </Text>
      );
    } else {
      return (
        <Text style={[styles.GradientText, { fontSize }]}>{text}</Text>
      );
    }
  };

  return (
    <MaskedView maskElement={renderText()}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[UserTheme.primary, UserTheme.secondary]}

      >
        <Text style={[styles.GradientText, { opacity: 0, fontSize }]}>{text}</Text>
      </LinearGradient>

    </MaskedView>
  );
};

export default GradientText;

const styles = StyleSheet.create({
  GradientText: {
    fontFamily: 'Arial Rounded MT Bold',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 36,
  },
});
