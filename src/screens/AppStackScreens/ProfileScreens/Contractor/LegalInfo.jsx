import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../../constant/Colors';
import { shadowStyle } from '../../../../constant/Shadow';
import { Global } from '../../../../constant/Global';
import FastImage from 'react-native-fast-image';

const LegalInfo = ({navigation}) => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const userDocRef = firestore().collection('users').doc(currentUser.uid);

    // Subscribe to real-time updates for documents
    const documentsListener = userDocRef.collection('documents').onSnapshot((querySnapshot) => {
      const documentsData = querySnapshot.docs.map((doc) => doc.data());
      setDocuments(documentsData);
    });

    // Subscribe to real-time updates for certificates
    const certificatesListener = userDocRef.collection('certificates').onSnapshot((querySnapshot) => {
      const certificatesData = querySnapshot.docs.map((doc) => doc.data());
      setCertificates(certificatesData);
    });

    // Unsubscribe listeners when the component unmounts
    return () => {
      documentsListener();
      certificatesListener();
    };
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.FlatList}
        data={documents.concat(certificates)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.LinearGradientWrapper}>
          <LinearGradient
          colors={['#9E41F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.itemContainer}
        >
            {item.type ? (
              // Render documents
              <>
                <Text style={styles.documentType}>Document Type: {item.type}</Text>
                <Text style={styles.docInfo}>Document Number: {item.number}</Text>
                <Text style={styles.docInfo}>Full Name: {item.fullName}</Text>
                <Text style={styles.docInfo}>Country of Issue: {item.country}</Text>
                <Text style={styles.docInfo}>Date of Issue: {item.dateOfIssue}</Text>
                <Text style={styles.docInfo}>Date of Expiry: {item.dateOfExpiry}</Text>
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
                <Text style={styles.certificateTitle}>Certificate Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                {/* Display certificate images as needed */}
                {item.imageUrl && (
                  <FastImage source={{ uri: item.imageUrl }} style={styles.image} />
                )}
              </>
            )}
            </LinearGradient>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  LinearGradientWrapper: {
    ...shadowStyle
  },
  itemContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  documentType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  certificateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  docInfo: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    ...shadowStyle
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.lightPrimary,
  },
});

export default LegalInfo;
