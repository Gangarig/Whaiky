import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';



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
      <Text style={styles.title}>Legal Info</Text>
      <FlatList
        data={documents.concat(certificates)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {item.type ? (
              // Render documents
              <>
                <Text style={styles.documentType}>Document Type: {item.type}</Text>
                <Text>Document Number: {item.number}</Text>
                <Text>Full Name: {item.fullName}</Text>
                <Text>Country of Issue: {item.country}</Text>
                <Text>Date of Issue: {item.dateOfIssue}</Text>
                <Text>Date of Expiry: {item.dateOfExpiry}</Text>
                {/* Display images as needed */}
                {item.frontImage && (
                  <Image source={{ uri: item.frontImage }} style={styles.image} />
                )}
                {item.backImage && (
                  <Image source={{ uri: item.backImage }} style={styles.image} />
                )}
              </>
            ) : (
              // Render certificates
              <>
                <Text style={styles.certificateTitle}>Certificate Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                {/* Display certificate images as needed */}
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                )}
              </>
            )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  documentType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default LegalInfo;
