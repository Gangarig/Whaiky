import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView  } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categoriesData } from '../../dataStatic/categoriesData'
const Legalinfo = () => {
  return (
    <SafeAreaView>
    <ScrollView>
    <View>
      <Text>Legalinfo</Text>

    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default Legalinfo