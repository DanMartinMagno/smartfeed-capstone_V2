import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native';
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

  // Create refs for each card's scale animation
  const starterScaleAnim = useRef(new Animated.Value(0)).current;
  const growerScaleAnim = useRef(new Animated.Value(0)).current;
  const finisherScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the cards when the component mounts
    Animated.stagger(100, [
      Animated.spring(starterScaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.spring(growerScaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.spring(finisherScaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
  }, []);

  const handlePress = (type: 'starter' | 'grower' | 'finisher') => {
    dispatch(setType(type));
    navigation.navigate('Input');
  };

  const handlePressIn = (scaleAnim: Animated.Value) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Scale down when pressed
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleAnim: Animated.Value, cardType: 'starter' | 'grower' | 'finisher') => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to normal size
      useNativeDriver: true,
    }).start(() => handlePress(cardType));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Starter Card */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(starterScaleAnim)}
        onPressOut={() => handlePressOut(starterScaleAnim, 'starter')}
      >
        <Animated.View style={[styles.featureCard, styles.starterCard, { transform: [{ scale: starterScaleAnim }] }]}>
          <View style={styles.cardHeader}>
            <Image source={require('../assets/starter-icon.png')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Starter</Text>
          </View>
          <Text style={styles.featureDescription}>
          Starter for native swine, aged 2-4 weeks and weighing 23-35 kg, offers essentials for early growth and development.
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Grower Card */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(growerScaleAnim)}
        onPressOut={() => handlePressOut(growerScaleAnim, 'grower')}
      >
        <Animated.View style={[styles.featureCard, styles.growerCard, { transform: [{ scale: growerScaleAnim }] }]}>
          <View style={styles.cardHeader}>
            <Image source={require('../assets/grower-icon.png')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Grower</Text>
          </View>
          <Text style={styles.featureDescription}>
          Grower for native swine, aged 5-12 weeks and weighing 35-75 kg, supports steady growth and muscle development.
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Finisher Card */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(finisherScaleAnim)}
        onPressOut={() => handlePressOut(finisherScaleAnim, 'finisher')}
      >
        <Animated.View style={[styles.featureCard, styles.finisherCard, { transform: [{ scale: finisherScaleAnim }] }]}>
          <View style={styles.cardHeader}>
            <Image source={require('../assets/finisher-icon.png')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Finisher</Text>
          </View>
          <Text style={styles.featureDescription}>
          Finisher for native swine, aged 13+ weeks and weighing 75 kg+, ensures optimal weight gain and readiness for market.
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
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
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starterCard: {
    backgroundColor: '#93f9a1',
  },
  growerCard: {
    backgroundColor: '#aabdfd',
  },
  finisherCard: {
    backgroundColor: '#A0E7E5',
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
});

export default DashboardScreen;
