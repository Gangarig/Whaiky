import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import UserTheme from '../../constant/Theme';
import Fonts from '../../constant/Fonts';
import { shadowStyle } from '../../constant/Shadow';
import { useAuth } from '../../context/AuthContext';


const DrawerItems = ({navigation}) => {
  const [activeItem, setActiveItem] = useState('Home');
  const  {currentUser}  = useAuth();
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
            end={{ x: 1, y: 0 }}
            colors={[UserTheme.primary, UserTheme.secondary]}
          >
            <FontAwesomeIcon icon={icon} size={isActive ? 25 : 25} color={UserTheme.white} />
            <Text style={[drawerItem.text, { color: UserTheme.white }]}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={drawerItem.default}>
            <FontAwesomeIcon icon={icon} size={24} color={UserTheme.text} />
            <Text style={drawerItem.text}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[drawerItem.container, shadowStyle]}>
      <DrawerItem item='MyPostsScreen' icon="fa-regular fa-file-lines" label="My Posts" />
      <DrawerItem item='Contractor' icon="fa-solid fa-clipboard-list" label="Contractors" />
      {currentUser.status === 'admin' ?(
      <DrawerItem item='Dashboard' icon="fa-solid fa-desktop" label="Dashboard" />
      ):null}
      {currentUser.status === 'contractor' ?(
      <>
      <DrawerItem item='Services'  icon="fa-solid fa-icons"  label="Service" />
      <DrawerItem item='LegalInfo' icon="fa-solid fa-id-card"  label="Legal Info" />
      <DrawerItem item='FeedBack' icon="fa-solid fa-envelopes-bulk"  label="Feed Back" />
      </>
      ):null}

      <DrawerItem item='Settings' icon="fa-solid fa-gear" label="Settings "/>
    </View>
  );
};

export default DrawerItems;

const styles = StyleSheet.create({
  activeShadow: Platform.select({
    ios: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 1.5,
    },
    android: {
      elevation: 2,
    },
  }),
});



const drawerItem = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UserTheme.white,
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
    color: UserTheme.text,
  },
  gradientWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: UserTheme.black,
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
