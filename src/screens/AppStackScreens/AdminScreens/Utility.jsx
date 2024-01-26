import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';



export const approveDocument = async (userId, docId) => {
  try {
    const userDocRef = firestore().collection('users').doc(userId);
    const contractorDocRef = firestore().collection('contractor').doc(userId);
    const submissionDocRef = firestore().collection('submission').doc(userId);

    // Start a batch write
    const batch = firestore().batch();

    // Update the document status
    batch.update(userDocRef.collection('documents').doc(docId), { status: 'approved' });

    // Update the user's status
    batch.update(userDocRef, { status: 'contractor' });

    // Set the contractor data
    batch.set(contractorDocRef, { userId: userId, approvedDocumentId: docId });

    // Delete the submission
    batch.delete(submissionDocRef);

    // Commit the batch
    await batch.commit();

    showMessage({ message: 'Document approved successfully', type: 'success' });
  } catch (error) {
    console.error('Error approving document: ', error);
    showMessage({ message: 'Error approving document', type: 'danger' });
  }
};



export const denyDocument = async (userId, docId) => {
  try {
    const docRef = firestore().collection('users').doc(userId).collection('documents').doc(docId);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      showMessage({ message: "Document does not exist", type: "danger" });
      return;
    }

    const docData = docSnapshot.data();

    // Delete images from Firebase Storage
    const deletePromises = [];
    if (docData.frontImage) {
      deletePromises.push(storage().refFromURL(docData.frontImage).delete());
    }
    if (docData.backImage) {
      deletePromises.push(storage().refFromURL(docData.backImage).delete());
    }

    await Promise.all(deletePromises);

    // Delete the document from Firestore
    await docRef.delete();

    // Optionally, delete related data in 'submission' collection
    await firestore().collection('submission').doc(userId).delete();

    showMessage({ message: 'Document and images deleted successfully', type: 'success' });
  } catch (error) {
    console.error('Error deleting document and images: ', error);
    showMessage({ message: 'Error deleting document and images', type: 'danger' });
  }
};

  
  
  