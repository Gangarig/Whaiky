import React from 'react';
import {Text} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import Fonts from '../constant/Fonts';


const GradientText = ({ colors, size = 20, underline = false, style, ...rest }) => {
  const textStyle = [
    styles.text,
    style,
    { fontSize: size, textDecorationLine: underline ? 'underline' : 'none' },
  ];

  return (
    <MaskedView maskElement={<Text {...rest} style={textStyle} />}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text {...rest} style={[...textStyle, styles.hiddenText]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily:Fonts.primary,
  },
  hiddenText: {
    opacity: 0, 
  },
});