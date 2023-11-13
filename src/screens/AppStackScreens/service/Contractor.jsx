import { View, Text,Button ,StyleSheet} from 'react-native'
import React from 'react'
import { useAuth } from '../src/context/AuthContext'
import { Global } from '../style/Global'
import GradientButton from '../style/GradientButton'

const Contractor = ({navigation}) => {
  return (
    <View style={Global.container}>
      <Text style={Global.title}>Contractor</Text>
        <View style={styles.container}>
        <GradientButton text="Legal Information" onPress={()=>navigation.navigate('LegalInfo')} />
        <GradientButton text="Service Categories" onPress={()=>navigation.navigate('Services')} />
        <GradientButton text="Upload Documents" onPress={()=>navigation.navigate('DocumentUpload')} />
        <GradientButton text="Provide Certificates" onPress={()=>navigation.navigate('Certificate')} />
        
        </View>
        <Button title='Go Back' onPress={()=>navigation.goBack()}/>
    </View>
  )
}

export default Contractor

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        gap:10,
        backgroundColor:Global.backgroundColor
    }
})