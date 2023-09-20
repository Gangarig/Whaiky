import React, { Component } from 'react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-input';

class PhoneNumberInput extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
    };
  }

  onPhoneInputChange = (value) => {
    this.setState({ phoneNumber: value });
  }

  render() {
    return (
      <View>
        <PhoneInput
          style={{ height: 40, width: 200 }}
          ref={(ref) => {
            this.phone = ref;
          }}
          initialCountry="us"
          value={this.state.phoneNumber}
          onChangePhoneNumber={this.onPhoneInputChange}
        />
        {/* You can access the phone number using this.state.phoneNumber */}
      </View>
    );
  }
}

export default PhoneNumberInput;
