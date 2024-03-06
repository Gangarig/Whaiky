// Footer.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Footer = ({ theme, loadMoreItems, hasMore, isLoadingMore }) => {
  return (
    <View style={styles(theme).container}>
      {isLoadingMore ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : hasMore ? (
        <TouchableOpacity onPress={loadMoreItems} style={styles(theme).button}>
          <Text style={styles(theme).buttonText}>Load More</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles(theme).noMoreText}>No more items to load</Text>
      )}
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: theme.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.buttonText,
    fontSize: 16,
  },
  noMoreText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});

export default Footer;
