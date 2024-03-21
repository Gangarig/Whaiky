import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
const Loading = () => {

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
  },
  text: {
    marginTop: 10,
  },
});

export default Loading;
