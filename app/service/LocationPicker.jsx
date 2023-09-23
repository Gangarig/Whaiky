import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country } from 'country-state-city';

const LocationPicker = () => {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);
  
  useEffect(() => {
    const countryList = Country.getAllCountries().map(country => ({
      label: country.name,
      value: country.isoCode
    }));
    setCountryItems(countryList);
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>Location Picker</Text>
        
        <Text>Country</Text>
        <DropDownPicker
          open={countryOpen}
          value={country}
          items={countryItems}
          setOpen={setCountryOpen}
          setValue={setCountry}
          searchable={true}
          searchPlaceholder="Search for a country..."
          // You can also provide a custom function to filter items with the filterItems prop
        />

        {/* Continue with dropdowns for states and cities... */}
        
        {country && <Text>Country: {country}</Text>}
        {state && <Text>State: {state}</Text>}
        {city && <Text>City: {city}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default LocationPicker;
