import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import FAQItem from '../components/FAQItem';
import { styles } from '../styles/faqScreen_styles';
import { fetchFAQData } from '../api/faq';

const FAQScreen: React.FC = () => {
  const [faqData, setFaqData] = useState<{ question: string; answer: string }[]>([]);

  useEffect(() => {
    fetchFAQData().then(data => setFaqData(data));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </ScrollView>
  );
};

export default FAQScreen;
