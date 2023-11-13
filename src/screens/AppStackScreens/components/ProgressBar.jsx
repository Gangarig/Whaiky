import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ProgressBar component
const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

export default ProgressBar;
const styles = StyleSheet.create({
  progressContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});


