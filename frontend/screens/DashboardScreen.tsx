import React from 'react';
import { View, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { setType } from '../store/feedSlice';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();

  const handlePress = (type: 'starter' | 'grower' | 'finisher') => {
    dispatch(setType(type));
    navigation.navigate('Input');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Starter" onPress={() => handlePress('starter')} />
      <Button title="Grower" onPress={() => handlePress('grower')} />
      <Button title="Finisher" onPress={() => handlePress('finisher')} />
    </View>
  );
};

export default DashboardScreen;
