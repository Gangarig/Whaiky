import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Global } from '../../../constant/Global';
import { showMessage } from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image'
import { shadowStyle } from '../../../constant/Shadow';
import Colors from '../../../constant/Colors';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import DocumentCard from '../../../components/DocumentCard';
import { denyDocument,approveDocument } from './Utility';

const SubmissionDetail = ({ navigation, route }) => {
  const id = route.params.id;
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const documentRef = firestore()
        .collection('users')
        .doc(id)
        .collection('documents');
  
      const docSnap = await documentRef.get();
      const documents = [];
      docSnap.forEach((doc) => {
        if (doc.exists) {
          // Add the document ID to the document data
          const docData = doc.data();
          documents.push({ ...docData, docId: doc.id });
        }
      });
      setDocs(documents);

    } catch (error) {
      console.error("Error fetching documents: ", error);
      showMessage({
        message: "Error fetching documents",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleApprove = async (docId) => {
    await approveDocument(id, docId);
    navigation.goBack();
  };
  const handleDeny = async (docId) => {
    await denyDocument(id, docId);
    navigation.goBack();
  }


  return (
      <FlatList
        data={docs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <DocumentCard 
          item={item}
          onApprove={() => handleApprove(item.docId)}
          onDeny={() => handleDeny(item.docId)}
          />
        )}
        style={styles.container}
      />
  );
};

export default SubmissionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});