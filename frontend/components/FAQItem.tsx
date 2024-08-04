import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/faqScreen_styles';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <View style={styles.itemContainer}>
        <Text style={styles.question}>{question}</Text>
        {expanded && <Text style={styles.answer}>{answer}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default FAQItem;
