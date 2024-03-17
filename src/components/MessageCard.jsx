import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { text } from '@fortawesome/fontawesome-svg-core'

const MessageCard = ({item,onPress}) => {
    const theme = useTheme()
    const styles = getStyles(theme)

    const deleteMessage = async (id) => {
        try {
            await firestore().collection('support').doc(id).delete()
            showMessage({
                message: 'Message Deleted',
                type: 'success',
            })
        } catch (error) {
            console.error('Error deleting message:', error)
            showMessage({
                message: 'Error deleting message',
                type: 'danger',
            })
        }
    }

    

  return (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.labels}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.label}>UserId:</Text>
            </View>
            <View style={styles.values}>
                <Text style={styles.value}>{item?.email}</Text>
                <Text style={styles.value}>{item?.userId}</Text>
            </View>
        </View>
        <View style={styles.body}>
         <Text style={styles.ticketText}>{item?.message}</Text>
        </View>
    </View>
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMessage(item.id)}>
        <FontAwesomeIcon icon="fa-solid fa-x" color={theme.primary} size={15} />
    </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MessageCard

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        borderWidth:1,
        borderColor:theme.primary,
        borderRadius:12,
        marginBottom:16,
        paddingVertical:10,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-around',
    },
    labels:{
        width:55,
    },
    label:{
        color:theme.text,
        fontWeight:'bold',
        fontSize:14,
    },
    values:{
        
    },
    value:{
        color:theme.text,
        fontSize:14,
    },
    body:{
        marginHorizontal:10,
        borderWidth:.5,
        borderColor:theme.primary,
        borderRadius:12,
        padding:10,
        marginTop:10,
        minHeight:50,
    },
    ticketText:{
        color:theme.text,
        fontSize:14,
    },
    deleteButton:{
        position:'absolute',
        right:10,
        top:10,
    }

    })