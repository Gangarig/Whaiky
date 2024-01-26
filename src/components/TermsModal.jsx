import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import { showMessage } from 'react-native-flash-message';
import PrimaryButton from './Buttons/PrimaryButton';
import UserTheme from '../constant/Theme';
import { shadowStyle } from '../constant/Shadow';

const TermsModal = ({ visible, onAccept, onClose }) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalView}>
          <Pdf
            source={require('../assets/terms.pdf')} 
            onLoadComplete={(numberOfPages, filePath) => {
              showMessage({ message: 'Terms and Conditions loaded', type: 'success' });
            }}
            onError={(error) => {
              console.log(error);
              showMessage({ message: 'Error loading Terms and Conditions', type: 'danger' });
            }}
            style={styles.pdf}
          />
          <View style={styles.buttonContainer}>
            <PrimaryButton text="Accept" onPress={onAccept} />
            <PrimaryButton text="Close" onPress={onClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: UserTheme.gray,
    borderTopWidth: .5,
    ...shadowStyle,
    width: '100%',
    padding: 10,
  },
});
