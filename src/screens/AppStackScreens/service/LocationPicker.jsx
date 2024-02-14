import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country, State, City } from 'country-state-city';
import { showMessage } from 'react-native-flash-message';
import { Global } from '../../../constant/Global';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../context/ThemeContext';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={Global.title}>Choose a Location</Text>
        
        <Text style={Global.titleSecondary}>Country</Text>
        <DropDownPicker
          open={countryOpen}
          value={country}
          items={countryItems}
          setOpen={handleCountryOpen}
          setValue={handleCountryChange}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          scrollViewProps={{
            style: styles.dropdownScrollView,
          }}
          zIndex={countryOpen ? 10000 : 1000}
          zIndexInverse={1000}
          closeAfterSelectByDefault={true}
        />
        {stateItems.length > 0 && (
          <>
            <Text style={Global.titleSecondary}>State</Text>
            <DropDownPicker
              open={stateOpen}
              value={state}
              items={stateItems}
              setOpen={handleStateOpen}
              setValue={handleStateChange}
              style={styles.dropdown}
              textStyle={styles.textStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              scrollViewProps={{
                style: styles.dropdownScrollView,
              }}
              zIndex={stateOpen ? 10000 : 2000}
              zIndexInverse={2000}
              closeAfterSelectByDefault={true}
              ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
              ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
              TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
            />
          </>
        )}
        {cityItems.length > 0 && (
          <>
            <Text style={Global.titleSecondary}>City</Text>
            <DropDownPicker
              open={cityOpen}
              value={city}
              items={cityItems}
              setOpen={handleCityOpen}
              setValue={handleCityChange}
              style={styles.dropdown}
              textStyle={styles.textStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              scrollViewProps={{
                style: styles.dropdownScrollView,
              }}
              zIndex={cityOpen ? 10000 : 3000}
              zIndexInverse={3000}
              closeAfterSelectByDefault={true}
              ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
              ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
              TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
            />
          </>
        )}
      <View style={styles.btnContainer}>
        <PrimaryButton text="Save" onPress={handleSaveAndClose} />
        <PrimaryButton text="Cancel" onPress={onClose} />
      </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 400, // Add this
  },

  centeredContainer: {
    width: '95%',
    gap: 5,
  },
  dropdownContainer: {
    marginTop: 10,
    width: '100%',
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:10,
    borderWidth: 2.5,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
  },
  dropdownScrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  subContainer: {
    gap: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent:'space-between', // Changed from 'space-between
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default LocationPicker;
