import React, { useState } from 'react'
import { Button,View,Text , StyleSheet, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { useTheme } from '../context/ThemeContext'
import Fonts from '../constant/Fonts'
import { width } from '@fortawesome/free-solid-svg-icons/faPen'

const DatePickerComponent = ({onClose,onSave,title,textStyle,buttonStyle}) => {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const styles = getStyles(theme)
  const dateToString = date.toLocaleDateString('en-US')


  return (
    <View style={styles.container}>
        <TouchableOpacity 
        onPress={() => setOpen(true)}
        style={[styles.datePicker,buttonStyle]}
        >
        <Text style={[styles.date,textStyle]}>{dateToString}</Text>
        </TouchableOpacity>
      <DatePicker
        modal
        title={title}
        open={open}
        date={date}
        mode='date'
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
          if (onSave) {
            onSave(date)
          }
        }}
        onCancel={() => {
          setOpen(false)
          if (onClose) {
            onClose()
          }
        }}
      />
    </View>
  )
}

const getStyles = (theme) => {
    return {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width : '100%',
        },
        datePicker:{

        },
        date:{
          color: theme.text,
          fontFamily: Fonts.primary,
          fontSize: 20,
        }
    }
    }

export default DatePickerComponent