import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country, State, City } from 'country-state-city';
import { useTheme } from '../../../context/ThemeContext';
import { Global } from '../../../constant/Global';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Location = React.memo(({ onSave, onClose }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [countryItems, setCountryItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);

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

      if (cityList.length === 0) {
        setSelectedCity(selectedState);
      }
    }
  }, [selectedCountry, selectedState]);

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
        style={styles.dropdown}
        textStyle={styles.textStyle}
        dropDownContainerStyle={styles.dropdownContainer}
        ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
        ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
        TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
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
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            closeAfterSelectByDefault={true}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
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
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            closeAfterSelectByDefault={true}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
          />
        </>
      )}

      <View style={styles.buttonBox}>
        <PrimaryButton
          style={styles.button}
          text="Done"
          onPress={() => onSave(selectedCountry, selectedState, selectedCity)}
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.text,
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
    borderWidth: 2.5,
  },
});

export default React.memo(Location);
