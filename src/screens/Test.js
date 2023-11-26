import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';
import DangerButton from '../components/Buttons/DangerButton'
import SecondaryButton from '../components/Buttons/SecondaryButton'
import PrimaryButton from '../components/Buttons/PrimaryButton'
import SuccessButton from '../components/Buttons/SuccessButton'
import WarningButton from '../components/Buttons/WarningButton'
import LogoutButton from '../service/LogOut'
import SVGIcons from '../constant/SVGIcons'
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import ProfileCard from '../components/ProfileCard';
import BackButton from '../components/Buttons/BackButton';
import PostCardDetail from '../components/PostCardDetail';
const Test = () => {
  return (
    <View style={styles.container}>
        <BackButton />
        <DangerButton text={'TEST'}/>
        <SecondaryButton text={'TEST'} />
        <PrimaryButton text={'TEST'} />
        <SuccessButton text={'TEST'} />
        <WarningButton text={'TEST'} />
        <LogoutButton text={'TEST'} />
    </View>

  )
}

export default Test

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
