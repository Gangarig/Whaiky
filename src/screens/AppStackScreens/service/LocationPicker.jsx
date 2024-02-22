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
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [countryItems, setCountryItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);

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
      setState(null); // Reset state selection on country change
      setCity(null);  // Reset city selection on country change
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

      // If the state doesn't have cities, set city to state value
      if (cityList.length === 0) {
        setCity(state);
      } else {
        setCity(null); // Reset city selection on state change
      }
    }
  }, [state, country]);

  const handleCountryOpen = useCallback(() => {
    setCityOpen(false);
    setStateOpen(false);
    setCountryOpen(prevState => !prevState);
  }, []);

  const handleStateOpen = useCallback(() => {
    setCityOpen(false);
    setCountryOpen(false);
    setStateOpen(prevState => !prevState); 
  }, []);

  const handleCityOpen = useCallback(() => {
    setCountryOpen(false);
    setStateOpen(false);
    setCityOpen(prevState => !prevState);
  }, []);


  const handleCountryChange = (value) => {
    setCountry(value);
  };

  const handleStateChange = (value) => {
    setState(value);
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

  useEffect(() => {
    console.log("LocationPicker rendered!");
  }, []);

  return (
      <View style={styles.container}>
        <Text style={Global.title}>Location</Text>
        
        <Text style={styles.text}>Country</Text>
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
        />
        {stateItems.length > 0 && (
          <>
            <Text style={styles.text}>State</Text>
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
            />
          </>
        )}
        {cityItems.length > 0 && (
          <>
            <Text style={styles.text}>City</Text>
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
            />
          </>
        )}
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
    margin:0,
    gap:10,
    backgroundColor:theme.white,
    zIndex: 9999,
    padding:10,
    flex:1,
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:12,
    borderWidth: 1,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
    borderWidth: 1,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    gap:10,
    marginTop:10,
  },
  buttonBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    color: theme.text,
    fontFamily: Fonts.primary,
  },

  
});


export default LocationPicker;
