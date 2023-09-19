import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const yourhandle = require('countrycitystatejson');

const CountryStateCity = ({ onCountryChange, onStateChange, onCityChange }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState(''); // Clear state when changing country
    setSelectedCity(''); // Clear city when changing country
    onCountryChange(value); // Add this line to update the parent component
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedCity(''); // Clear city when changing state
    onStateChange(value); // Add this line to update the parent component
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    onCityChange(value); // Add this line to update the parent component
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Country</Text>
      <Picker
        selectedValue={selectedCountry || ''}
        onValueChange={(itemValue) => handleCountryChange(itemValue)}
      >
        <Picker.Item label="Select your Country" value="" />
        {yourhandle.getCountries().map((country, index) => (
          <Picker.Item key={index} label={country.name} value={country.shortName} />
        ))}
      </Picker>

      {selectedCountry && (
        <>
          <Text style={styles.label}>Select State</Text>
          <Picker
            selectedValue={selectedState || ''}
            onValueChange={(itemValue) => handleStateChange(itemValue)}
          >
            <Picker.Item label="Select your State" value="" />
            {yourhandle.getStatesByShort(selectedCountry).map((state, index) => (
              <Picker.Item key={index} label={state} value={state} />
            ))}
          </Picker>
        </>
      )}

      {selectedState && (
        <>
          <Text style={styles.label}>Select City</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => handleCityChange(itemValue)}
          >
            <Picker.Item label="Select your City" value="" />
            {yourhandle.getCities(selectedCountry, selectedState).map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CountryStateCity;
