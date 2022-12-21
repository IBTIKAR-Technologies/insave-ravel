import { View, Text } from 'react-native'
import React, { useState, useRef } from 'react'
import { Picker } from '@react-native-picker/picker';

export default function Select2() {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  return (
    <Picker
      ref={pickerRef}
      selectedValue={selectedLanguage}
      onValueChange={(itemValue, itemIndex) =>
        setSelectedLanguage(itemValue)
      }

    >
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>
  )
}