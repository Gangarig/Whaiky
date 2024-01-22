import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../../../../context/AuthContext';



export const approveDocument = async (userId, docId) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('documents')
        .doc(docId)
        .update({ status: 'approved' });
        await firestore()
        .collection('users')
        .doc(userId)
        .update({ status: 'contractor' });
        await firestore()
        .collection('contractor')
        .doc(userId) 
        .set({
          userId: userId,
          approvedDocumentId: docId,
        });
      await firestore().collection('submission').doc(userId).delete();
  
      showMessage({
        message: 'Document approved successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error approving document: ', error);
      showMessage({
        message: 'Error approving document',
        type: 'danger',
      });
    }
  };


  export const denyDocument = async (userId, docId) => {
    try {
      // Get the document from Firestore to retrieve image URLs
      const docRef = firestore().collection('users').doc(userId).collection('documents').doc(docId);
      const docSnapshot = await docRef.get();
      
      if (!docSnapshot.exists) {
        showMessage({
          message: "Document does not exist",
          type: "danger",
        });
        return;
      }
  
      const docData = docSnapshot.data();

      // Delete images from Firebase Storage if they exist
      if (docData.frontImage) {
        const frontImageRef = storage().refFromURL(docData.frontImage);
        await frontImageRef.delete();
      }
  
      if (docData.backImage) {
        const backImageRef = storage().refFromURL(docData.backImage);
        await backImageRef.delete();
      }
  
      // Delete the document from Firestore
      await docRef.delete();
  
      // Optionally, delete related data in 'submission' collection
      await firestore().collection('submission').doc(userId).delete();
  
      showMessage({
        message: 'Document and images deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting document and images: ', error);
      showMessage({
        message: 'Error deleting document and images',
        type: 'danger',
      });
    }
  };
  
  
  