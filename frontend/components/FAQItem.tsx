import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { styles } from '../styles/faqScreen_styles';
import { Ionicons } from '@expo/vector-icons';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <TouchableOpacity
      onPress={toggleOpen}
      style={[styles.itemContainer, isOpen && styles.activeItem]}
    >
      <View style={styles.row}>
        <Text style={[styles.question, isOpen && styles.activeQuestion]}>
          {question}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color={isOpen ? '#19AA1F' : '#19AA1F'}
          style={styles.arrow}
        />
      </View>
      {isOpen && <Text style={styles.answer}>{answer}</Text>}
    </TouchableOpacity>
  );
};

export default FAQItem;
