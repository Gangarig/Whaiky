// Assuming your Menu component is something like this
import React from 'react';
import { View, Text, Button } from 'react-native';
import LogOut from '../../services/LogOut';

// Update the props here to accept toggleMenu
interface MenuProps {
  toggleMenu: () => void;
}

const Menu = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Your menu items here */}
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
      <LogOut />
    </View>
  );
};

export default Menu;
