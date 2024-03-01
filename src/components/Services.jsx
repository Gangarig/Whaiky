import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import Fonts from '../constant/Fonts'
import { useAuth } from '../context/AuthContext'

const Services = (services) => {
    const theme = useTheme()
    const styles = getStyles(theme)


  return (
<View style={styles.container}>
        {services.services.map((service, index) => (
            <View key={index} style={styles.wrapper}>
                <Text style={styles.categoryText}>{service.categoryText}</Text>
                <Text style={styles.optionText}>{service.optionText}</Text>
            </View>
        ))}
    </View>
  )
}

const getStyles = (theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: 16,
            borderBottomColor: theme.primary,
            borderBottomWidth: 1,
        },
        title: {
            marginBottom: 16,
            fontSize: 14,
            fontFamily: Fonts.primary,
            color: theme.text,
            fontWeight: 'bold',
        },
        wrapper: {
            borderTopColor: theme.primary,
            borderTopWidth: 1,
            paddingVertical: 16,
        },
        categoryText: {
            color: theme.text,
            fontSize: 14,
            fontFamily: Fonts.primary,
        },
        optionText: {
            color: theme.text,
            fontSize: 12,
            fontFamily: Fonts.primary,
        },
    })
}

export default Services