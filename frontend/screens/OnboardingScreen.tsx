import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
  onComplete: () => void;
};

const slides = [
  {
    id: '1',
    title: 'Start efficient feeding with SmartFeed',
    description:
      'Formulate the perfect feed, monitor growth, and optimize nutrition for your native swine effortlessly.',
    image: require('../assets/getstarted.png'),
  },
  {
    id: '2',
    title: 'Get accurate feed recipes in minutes!',
    description:
      'Simply enter number of swine, pick a recipe, and get a complete nutrient breakdown for effective feed formulation.',
    image: require('../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Nourish Success with SmartFeed',
    description:
      'Experience easy-to-use tools for formulating feeds, tracking growth, and boosting swine health.',
    image: require('../assets/onboarding3.png'),
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Scroll to the next slide
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });

      // Manually update the currentIndex to trigger a re-render
      setCurrentIndex(currentIndex + 1);
    } else {
      // If it's the last slide, navigate to Dashboard
      onComplete();
    }
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.floor(e.nativeEvent.contentOffset.x / width))
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === 0
              ? 'Get Started'
              : currentIndex === slides.length - 1
                ? 'Done'
                : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f9',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#707070',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
