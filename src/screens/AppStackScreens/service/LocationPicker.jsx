import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country, State, City } from 'country-state-city';
import { showMessage } from 'react-native-flash-message';
import { Global } from '../../../constant/Global';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../context/ThemeContext';
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton';
import Fonts from '../../../constant/Fonts';

const LocationPicker = ({ onSave , onClose }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);
  const [zIndex, setZIndex] = useState({ country: 3000, state: 2000, city: 1000 });

  useEffect(() => {
    const countryList = Country.getAllCountries().map(country => ({
      label: country.name,
      value: country.isoCode,
    }));
    setCountryItems(countryList);
  }, []);

  useEffect(() => {
    if (country) {
      const stateList = State.getStatesOfCountry(country).map(state => ({
        label: state.name,
        value: state.isoCode,
      }));

      setStateItems(stateList);
      setCountryOpen(false);
      setState(null); 
      setCity(null);  
    }
  }, [country]);

  useEffect(() => {
    if (state) {
      const cityList = City.getCitiesOfState(country, state).map(city => ({
        label: city.name,
        value: city.name,
      }));
      setCityItems(cityList);
      setStateOpen(false);

      
      if (cityList.length === 0) {
        setCity(state);
      } else {
        setCity(null); 
      }
    }
  }, [state, country]);

  const handleCountryOpen = useCallback(() => {
    setZIndex({ country: 3000, state: 2000, city: 1000 });
    setCityOpen(false);
    setStateOpen(false);
    setCountryOpen(prevState => !prevState);
  }, []);

  const handleStateOpen = useCallback(() => {
    setZIndex({ country: 3000, state: 4000, city: 1000 });
    setCityOpen(false);
    setCountryOpen(false);
    setStateOpen(prevState => !prevState); 
  }, []);

  const handleCityOpen = useCallback(() => {
    setZIndex({ country: 3000, state: 2000, city: 5000 });
    setCountryOpen(false);
    setStateOpen(false);
    setCityOpen(prevState => !prevState);
  }, []);


  const handleCountryChange = (value) => {
    setCountry(value);
  };

  const handleStateChange = (value) => {
    setState(value);
    console.log('state', value);
  };

  const handleCityChange = (value) => {
    setCity(value);
  };
  useEffect(() => {
    if (country && state) {
      if (cityItems.length > 0 && city) {
        setShowSaveButton(true);
      } else if (cityItems.length === 0) {
        setCity(state);
        setShowSaveButton(true);
      } else {
        setShowSaveButton(false);
      }
    } else {
      setShowSaveButton(false);
    }
  }, [country, state, city, cityItems]);
  
  const handleSaveAndClose = () => {
    onSave(country, state, city);
    if (onClose) onClose();
    showMessage({
      message: 'Location saved successfully!',
      type: 'success',
    });
  };

  return (
      <View style={styles.container}>
        <View >
        <Text style={styles.title}>Location</Text> 
        <Text style={styles.label}>Country</Text>
        <DropDownPicker
          open={countryOpen}
          value={country}
          items={countryItems}
          setOpen={handleCountryOpen}
          setValue={handleCountryChange}
          style={styles.dropdown}
          textStyle={styles.textStyle}
          dropDownContainerStyle={styles.dropdownContainer}
          closeAfterSelectByDefault={true}
          zIndex={zIndex.country}
          searchable={true}
        />
        {stateItems.length > 0 && (
          <>
            <Text style={styles.label}>State</Text>
            <DropDownPicker
              open={stateOpen}
              value={state}
              items={stateItems}
              setOpen={handleStateOpen}
              setValue={handleStateChange}
              style={styles.dropdown}
              textStyle={styles.textStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              closeAfterSelectByDefault={true}
              ArrowUpIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-up" />}
              ArrowDownIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-down" />}
              TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
              zIndex={zIndex.state}
           />
          </>
        )}
        {cityItems.length > 0 && (
          <>
            <Text style={styles.label}>City</Text>
            <DropDownPicker
              open={cityOpen}
              value={city}
              items={cityItems}
              setOpen={handleCityOpen}
              setValue={handleCityChange}
              style={styles.dropdown}
              textStyle={styles.textStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              closeAfterSelectByDefault={true}
              ArrowUpIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-up" />}
              ArrowDownIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-down" />}
              TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
              zIndex={zIndex.city}
              dropDownDirection='TOP'
            />
          </>
        )}
        </View>
          <View style={styles.buttonBox}>
          <TwoSelectButton
            primary="Save"
            secondary="Cancel"
            onPressPrimary={handleSaveAndClose}
            onPressSecondary={onClose}
          />
          </View>
      </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container:{
    width:'100%',
    backgroundColor:theme.backgroundColor,
    zIndex: 9999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex:1,
    justifyContent:'space-between',
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:12,
    borderWidth: 1,
    zIndex: 99,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
    borderWidth: 1,
  },
  buttonBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title : {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    fontFamily: Fonts.primary,
    textAlign: 'left',
    width: '100%',
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    color: theme.text,
    fontFamily: Fonts.primary,
    marginBottom: 6,
  },
  textStyle: {
    fontSize: 14,
    color: theme.text,
    fontFamily: Fonts.primary,
  },


  
});


export default LocationPicker;
