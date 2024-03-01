import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import PhoneInput from 'react-native-international-phone-number'; 
import { useTheme } from '../context/ThemeContext';
import Fonts from '../constant/Fonts';
import TwoSelectButton from './Buttons/TwoSelectButton';


const PhoneInputComponent = ({ visible, onSave, onCancel }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();
  const styles = getStyles(theme);

  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View>
          <Text style={styles.title}>Phone Number</Text>
          <PhoneInput
            value={inputValue}
            onChangePhoneNumber={handleInputValue}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
            phoneInputStyles={{
                container: {
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: theme.primary,
                },
                flagContainer: {
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                  backgroundColor: theme.background,
                  justifyContent: 'center',
                },
                flag: {},
                caret: {
                  color: theme.text,
                  fontSize: 16,
                },
                divider: {
                  backgroundColor: theme.primary,
                },
                input: {
                  color: theme.text,
                },
              }}
              modalStyles={{
                modal: {
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.primary,
                  borderRadius: 0,
                },
                backdrop: {},
                divider: {
                  backgroundColor: 'transparent',
                },
                countriesList: {},
                searchInput: {
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.primary,
                  color: theme.text,
                  backgroundColor: theme.background,
                  paddingHorizontal: 12,
                  height: 46,
                },
                countryButton: {
                  borderWidth: 1,
                  borderColor: theme.primary,
                  backgroundColor: theme.background,
                  marginVertical: 4,
                  paddingVertical: 0,
                },
                noCountryText: {},
                noCountryContainer: {},
                flag: {
                  color: theme.primary,
                  fontSize: 20,
                },
                callingCode: {
                  color: theme.text,
                },
                countryName: {
                  color: theme.text,
                },
              }}
          />
          <View style={{ marginTop: 10 }}>
            <Text style={styles.value}>
              Country: {`${selectedCountry?.name?.en} (${selectedCountry?.cca2})`}
            </Text>
            <Text style={styles.value}>
              Phone Number: {`${selectedCountry?.callingCode} ${inputValue}`}
            </Text>
          </View>
          </View>
          <View>
          <TwoSelectButton
              primary={"Save"}
              secondary={"Cancel"}
              onPressPrimary={() => onSave(`${selectedCountry?.callingCode} ${inputValue}`)}
              onPressSecondary={onCancel}
          />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PhoneInputComponent;

const getStyles = (theme) => {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      borderTopColor: theme.primary,
      borderTopWidth: 1,
      backgroundColor: 'white',
      padding: 20,
      width: '100%',
      height: 400,
      position: 'absolute',
      bottom: 0,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: Fonts.primary,
      marginBottom: 20,
    },
    value : {
        fontSize: 14,
        color: theme.text,
        fontFamily: Fonts.primary,
        marginBottom: 6,
    },
  });
};
