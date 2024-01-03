import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';


export const approveDocument = async (userId, documentId) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('documents')
        .doc(documentId)
        .update({ status: 'approved' });
  
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
  
  export const denyDocument = async (userId, documentId) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('documents')
        .doc(documentId)
        .update({ status: 'denied' });
  
      showMessage({
        message: 'Document denied successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error denying document: ', error);
      showMessage({
        message: 'Error denying document',
        type: 'danger',
      });
    }
  };
  
  