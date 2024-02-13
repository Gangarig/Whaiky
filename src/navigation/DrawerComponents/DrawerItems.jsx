import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Fonts from '../../constant/Fonts';
import { shadowStyle } from '../../constant/Shadow';
import { useAuth } from '../../context/AuthContext';


const DrawerItems = ({navigation}) => {
  const [activeItem, setActiveItem] = useState('Home');
  const  {currentUser}  = useAuth();
  const theme = useTheme();
  const drawerItem = getStyles(theme);
  const styles = getStyle(theme);
  const handlePress = (item) => {
    setActiveItem(item);
    navigation.navigate(item);
  };

  const DrawerItem = ({ item, icon, label }) => {
    const isActive = item === activeItem;
    const containerStyle = isActive ? [drawerItem.wrapper, styles.activeShadow] : drawerItem.wrapper;

    return (
      <TouchableOpacity onPress={() => handlePress(item)} style={containerStyle}>
        {isActive ? (
          <LinearGradient
            style={[drawerItem.gradientWrapper]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0 }}
            colors={[theme.primary, theme.secondary]}
          >
            <FontAwesomeIcon icon={icon} size={isActive ? 25 : 25} color={theme.white} />
            <Text style={[drawerItem.text, { color: theme.white }]}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={drawerItem.default}>
            <FontAwesomeIcon icon={icon} size={24} color={theme.text} />
            <Text style={drawerItem.text}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[drawerItem.container, shadowStyle]}>
      <DrawerItem item='MyPostsScreen' icon="fa-regular fa-file-lines" label="My Posts" />
      <DrawerItem item='ContractorScreen' icon="fa-solid fa-clipboard-list" label="Contractors" />
      {currentUser.status === 'admin' ?(
      <DrawerItem item='Dashboard' icon="fa-solid fa-desktop" label="Dashboard" />
      ):null}
      {currentUser.status === 'contractor' ?(
      <>
      <DrawerItem item='Services'  icon="fa-solid fa-icons"  label="Service" />
      <DrawerItem item='LegalInfo' icon="fa-solid fa-id-card"  label="Legal Info" />
      <DrawerItem item='Reviews' icon="fa-solid fa-envelopes-bulk"  label="Reviews" />
      </>
      ):null}

      {/* <DrawerItem item='Settings' icon="fa-solid fa-gear" label="Settings "/> */}
    </View>
  );
};

export default DrawerItems;

const getStyle= (theme) => StyleSheet.create({
  activeShadow: Platform.select({
    ios: {
      shadowColor: theme.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 1.5,
    },
    android: {
      elevation: 2,
    },
  }),
});




const getStyles = (theme) => {
  return StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.white,
    gap: 10,
    alignItems: 'center',
    paddingVertical: 20,
  },
  wrapper: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    width: '80%',
    borderRadius: 10,
  },
  text: {
    fontFamily: Fonts.primary,
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "normal",
    paddingTop: 2,
    color: theme.text,
  },
  gradientWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: theme.black,
    borderWidth: .5,

  },
  default: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
}