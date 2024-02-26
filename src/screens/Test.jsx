import React, { useState } from 'react'
import { Button } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { View } from 'react-native'

const Test = () => {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)


  return (
    <View style={style.co}>
      
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        mode='date'
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </View>
  )
}

export default Test