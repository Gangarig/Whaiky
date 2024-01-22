import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../../constant/Colors';
import { shadowStyle } from '../../../../constant/Shadow';
import { Global } from '../../../../constant/Global';
import FastImage from 'react-native-fast-image';
import UserTheme from '../../../../constant/Theme';

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
              <View style={styles.docInfoWrapper}>
                <Text style={styles.documentType}>Document Type:</Text>
                <Text style={styles.docInfo}>{item.type}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Document Number:</Text>
                <Text style={styles.docInfo}>{item.number}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Full Name:</Text>
                <Text style={styles.docInfo}>{item.fullName}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Country of Issue:</Text>
                <Text style={styles.docInfo}>{item.country}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Date of Issue:</Text>
                <Text style={styles.docInfo}>{item.dateOfIssue}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Date of Expiry:</Text>
                <Text style={styles.docInfo}>{item.dateOfExpiry}</Text>
              </View>

              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Document Status:</Text>
                <Text style={styles.docInfo}>{item.status}</Text>
              </View>

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
              <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Certificate Title:</Text>
                <Text style={styles.docInfo}>{item.title}</Text>
              </View>             
               <View style={styles.docInfoWrapper}>
                <Text style={styles.docInfo}>Description:</Text>
                <Text style={styles.docInfo}>{item.description}</Text>
              </View>
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
    paddingHorizontal: 20,
  },
  LinearGradientWrapper: {
    ...shadowStyle
  },
  itemContainer: {
    backgroundColor: UserTheme.background,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  documentType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UserTheme.white,
  },
  certificateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UserTheme.white,
  },
  docInfo: {
    fontSize: 16,
    color: UserTheme.white,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: UserTheme.white,
    ...shadowStyle
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: UserTheme.lightPrimary,
  },
  docInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LegalInfo;
