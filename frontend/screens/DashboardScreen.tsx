import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Starter Card */}
      <TouchableOpacity style={[styles.featureCard, styles.starterCard]} onPress={() => handlePress('starter')}>
        <View style={styles.cardHeader}>
          <Image source={require('../assets/starter-icon.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>Starter</Text>
        </View>
        <Text style={styles.featureDescription}>
          The Starter plan is ideal for those just beginning their journey. Get the essentials you need to kickstart your progress.
        </Text>
      </TouchableOpacity>

      {/* Grower Card */}
      <TouchableOpacity style={[styles.featureCard, styles.growerCard]} onPress={() => handlePress('grower')}>
        <View style={styles.cardHeader}>
          <Image source={require('../assets/grower-icon.jpg')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>Grower</Text>
        </View>
        <Text style={styles.featureDescription}>
          The Grower plan is designed to help you expand and take your goals to the next level. Increase your output with advanced tools.
        </Text>
      </TouchableOpacity>

      {/* Finisher Card */}
      <TouchableOpacity style={[styles.featureCard, styles.finisherCard]} onPress={() => handlePress('finisher')}>
        <View style={styles.cardHeader}>
          <Image source={require('../assets/finisher-icon.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>Finisher</Text>
        </View>
        <Text style={styles.featureDescription}>
          The Finisher plan is for those ready to complete their journey with finesse and precision. End strong with all the support you need.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  featureCard: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row', // Aligns the icon and title horizontally
    alignItems: 'center', // Centers the icon and title vertically
    marginBottom: 10, // Spacing between the header and the description
  },
  starterCard: {
    backgroundColor: '#B2F2BB', // Gold
  },
  growerCard: {
    backgroundColor: '#E3CFFF', // LimeGreen
  },
  finisherCard: {
    backgroundColor: '#A0E7E5', // DodgerBlue
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 10, // Spacing between icon and title
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default DashboardScreen;
