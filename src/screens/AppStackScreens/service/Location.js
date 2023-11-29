import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country, State, City } from 'country-state-city';
import Colors from '../../../constant/Colors';
import shadowStyle from '../../../constant/Shadow';
import { Global } from '../../../constant/Global';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { showMessage } from 'react-native-flash-message';

const Location = React.memo(({ onSave, onClose }) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [countryItems, setCountryItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);

  // Memoizing the country list
  const countryList = useMemo(() => Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  })), []);

  const onCountryOpen = useCallback(() => {
    setStateOpen(false);
    setCityOpen(false);
  }, []);

  const onStateOpen = useCallback(() => {
    setCountryOpen(false);
    setCityOpen(false);
  }, []);

  const onCityOpen = useCallback(() => {
    setCountryOpen(false);
    setStateOpen(false);
  }, []);

  useEffect(() => {
    setCountryItems(countryList);
  }, [countryList]);

  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
      setStateItems(stateList);
      setCountryOpen(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
        label: city.name,
        value: city.name,
      }));
      setCityItems(cityList);
    }
  }, [selectedCountry, selectedState]);

  const Submit = useCallback(() => {
    if (!selectedCountry) {
      showMessage({
        message: 'Please select a country!',
        type: 'danger',
      });
      return;
    }
    if (!selectedState) {
      showMessage({
        message: 'Please select a state!',
        type: 'danger',
      });
      return;
    }
  
    if (cityItems.length > 0) {
      showMessage({
        message: 'Please select a city!',
        type: 'danger',
      });
      return;
    } 

    
  
    onSave(selectedCountry, selectedState, selectedCity);
    if (onClose) onClose();
  
    showMessage({
      message: 'Location saved successfully!',
      type: 'success',
    });
    console.log('Location saved successfully!');
    console.log('Country: ', selectedCountry);
    console.log('State: ', selectedState);
    console.log('City: ', selectedCity);
  }, [selectedCountry, selectedState, selectedCity, onSave, onClose, cityItems]);
  
  return (
    <View style={styles.container}>
      <Text style={[Global.title, styles.title]}>Choose a Location</Text>
      <Text style={[Global.titleSecondary]}>Country</Text>
      <DropDownPicker
        open={countryOpen}
        onOpen={onCountryOpen}
        value={selectedCountry}
        items={countryItems}
        setOpen={setCountryOpen}
        setValue={setSelectedCountry}
        setItems={setCountryItems}
        placeholder="Select Country"
        zIndex={3000}
        zIndexInverse={1000}
        closeAfterSelectByDefault={true}
      />

      {stateItems.length > 0 && (
        <>
          <Text style={[Global.titleSecondary]}>State</Text>
          <DropDownPicker
            open={stateOpen}
            onOpen={onStateOpen}
            value={selectedState}
            items={stateItems}
            setOpen={setStateOpen}
            setValue={setSelectedState}
            setItems={setStateItems}
            placeholder="Select State"
            disabled={!selectedCountry}
            zIndex={2000}
            zIndexInverse={2000}
            closeAfterSelectByDefault={true}
          />
        </>
      )}

      {cityItems.length > 0 && (
        <>
          <Text style={[Global.titleSecondary]}>City</Text>
          <DropDownPicker
            open={cityOpen}
            onOpen={onCityOpen}
            value={selectedCity}
            items={cityItems}
            setOpen={setCityOpen}
            setValue={setSelectedCity}
            setItems={setCityItems}
            placeholder="Select City"
            disabled={!selectedCountry || !selectedState}
            zIndex={1000}
            zIndexInverse={3000}
            closeAfterSelectByDefault={true}
          />
        </>
      )}

      <View style={styles.buttonBox}>
        <PrimaryButton
          style={styles.button}
          text="Submit"
          onPress={Submit}
        />
        <PrimaryButton
          style={styles.button}
          text="Cancel"
          onPress={onClose}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    paddingVertical: 10,
    gap: 10,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, 
    zIndex: -1,
  },
  title: {
    color: Colors.primary,
  },
});

export default React.memo(Location);
