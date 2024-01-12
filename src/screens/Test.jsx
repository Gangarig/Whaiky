import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import GradientText from '../components/GradientText'
import Header from '../navigation/ScreenComponents/StackHeader'
import Footer from '../components/Footer'
import UserTheme from '../constant/Theme'

const Test = () => {
  return (
    <View style={styles.container}>
        <Header />
        <GradientText Text="Helasdfasdflo" />
        <Footer />
    </View>
  )
}

export default Test

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:UserTheme.background,
        justifyContent:'center',
        alignItems:'center',
    }
})