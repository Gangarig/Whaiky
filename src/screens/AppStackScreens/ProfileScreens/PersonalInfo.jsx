import { View, Text , StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const PersonalInfo = ({navigation}) => {
  const {currentUser} = useAuth()
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <ScrollView style={styles.ScrollView}
      contentContainerStyle={styles.ScrollViewContent}
    >
      <View style={styles.avatar}>
        <FontAwesomeIcon icon='fa-regular fa-user' size={100} color={theme.text} />
      </View>
    </ScrollView>
  )
}

export default PersonalInfo

const getStyles = (theme) => StyleSheet.create({
  ScrollView: {
    flex: 1,
    backgroundColor: theme.background,
  },
  ScrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
})
