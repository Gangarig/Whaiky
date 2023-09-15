// PhoneInputComponent.tsx

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PhoneInput from 'react-native-phone-input';

const PhoneInputComponent = forwardRef((props, ref) => {
  const [phone, setPhone] = useState('');

  useImperativeHandle(ref, () => ({
    getValue: () => phone,
  }));

  return (
    <PhoneInput
      initialCountry="us"
      onChangePhoneNumber={(number) => setPhone(number)}
    />
  );
});

export default PhoneInputComponent;
