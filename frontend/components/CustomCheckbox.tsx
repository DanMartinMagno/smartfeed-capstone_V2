import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  return (
    <TouchableOpacity onPress={onChange} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          height: 20,
          width: 20,
          borderColor: 'black',
          borderWidth: 1,
          backgroundColor: checked ? 'black' : 'white',
          marginRight: 8,
        }}
      />
      <Text>{checked ? 'Checked' : 'Unchecked'}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckbox;
