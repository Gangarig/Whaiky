import {ScrollView,StyleSheet ,TouchableOpacity} from 'react-native'
import React , { useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import Fonts from '../../../../constant/Fonts'
import DocumentCard from '../../../../components/DocumentCard'
const LegalInfo = ({route}) => {
  const { document } = route.params;
  const theme = useTheme()
  const styles = getStyles(theme)
  const [visible, setIsVisible] = useState(false);
  console.log(document)



  return (
    <ScrollView 
    styles={styles.container}
    showsHorizontalScrollIndicator  = {false}
    showsVerticalScrollIndicator = {false}
    contentContainerStyle={styles.ScrollView}
    >
      <DocumentCard item={document} />
    </ScrollView>
  )
}

export default LegalInfo

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  })
}
