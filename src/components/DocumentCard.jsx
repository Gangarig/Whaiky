import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Colors from '../constant/Colors';
import { shadowStyle } from '../constant/Shadow';
import PrimaryButton from './Buttons/PrimaryButton';

const DocumentCard = ({ item ,onApprove , onDeny}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9E41F0', '#4C7BC0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {item.type ? (
          // Render documents
          <>
            <Text style={styles.title}>Document Type: {item.type}</Text>
            <Text style={styles.info}>Document Number: {item.number}</Text>
            <Text style={styles.info}>Full Name: {item.fullName}</Text>
            <Text style={styles.info}>Country of Issue: {item.country}</Text>
            <Text style={styles.info}>Date of Issue: {item.dateOfIssue}</Text>
            <Text style={styles.info}>Date of Expiry: {item.dateOfExpiry}</Text>
            <Text style={styles.info}>Document Status: {item.status}</Text>
            {/* Display images as needed */}
            {item.frontImage && (
              <FastImage source={{ uri: item.frontImage }} style={styles.image} />
            )}
            {item.backImage && (
              <FastImage source={{ uri: item.backImage }} style={styles.image} />
            )}
          </>
        ) : (
          // Render certificates
          <>
            <Text style={styles.title}>Certificate Title: {item.title}</Text>
            <Text style={styles.info}>Description: {item.description}</Text>
            {/* Display certificate images as needed */}
            {item.imageUrl && (
              <FastImage source={{ uri: item.imageUrl }} style={styles.image} />
            )}
          </>
        )}
      </LinearGradient>
      {item.status === 'pending' && (
      <View style={styles.btnContainer}>
      <PrimaryButton text="Approve" onPress={() => onApprove(item.docId)} />
      <PrimaryButton text="Deny" onPress={() => onDeny(item.docId)} />
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadowStyle,
  },
  gradient: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    ...shadowStyle,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default DocumentCard;
