import { View, Text,StyleSheet } from 'react-native'
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

const Test = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Test</Text>
        <PrimaryButton text="Primary" />
        <SecondaryButton text="Secondary" />
        <DangerButton text="Danger" />
        <SuccessButton text="Success" />
        <WarningButton text="Warning" />
        <View >
          
          {SVGIcons.home} 
          {SVGIcons.categories}
          {SVGIcons.cogs}
          {SVGIcons.order}
          {SVGIcons.creaditCard}
          {SVGIcons.owner}
          {SVGIcons.profile}
          {SVGIcons.webforms}
          {SVGIcons.dashBoard}

          
        </View> */}
        <PostCard />
        <LogoutButton />
    </View>
  )
}

export default Test

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    backgroundColor: '#fff',
  },
});
