import React from 'react';
import { View, Modal, StyleSheet,TouchableOpacity,Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { showMessage } from 'react-native-flash-message';
import PrimaryButton from './Buttons/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { shadowStyle } from '../constant/Shadow';
import { LinearTextGradient } from 'react-native-text-gradient';

const TermsModal = ({ visible, onAccept, onClose }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
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
            <TouchableOpacity 
            style={styles.btn}
            onPress={onAccept}>
                <LinearTextGradient
                  style={styles.acceptButton}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[theme.primary, theme.secondary]}
                >
                  <Text style={{ color: 'transparent' }}>Disagree</Text>
                </LinearTextGradient>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.btn}
            onPress={onClose}>
                <LinearTextGradient
                  style={styles.declineButton}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[theme.primary, theme.secondary]}
                >
                  <Text style={{ color: 'transparent' }}>Agree</Text>
                </LinearTextGradient>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsModal;

const getStyles = (theme) => {
  return StyleSheet.create({
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
    borderTopColor: theme.gray,
    borderTopWidth: .5,
    ...shadowStyle,
    width: '100%',
    padding: 10,
  },
});
}
