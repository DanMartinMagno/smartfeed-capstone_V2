// FAQScreen.tsx
import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TextInput } from "react-native";
import FAQItem from "../components/FAQItem";
import { styles } from "../styles/faqScreen_styles";
import { fetchFAQData } from "../api/faq";

const FAQScreen: React.FC = () => {
  const [faqData, setFaqData] = useState<
    { question: string; answer: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFAQData().then((data) => setFaqData(data));
  }, []);

  // Filter FAQs based on the search query
  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group FAQs into chunks of 5 and assign headers
  const groupedFAQs = [
    { header: "Raising Native Swine", questions: filteredFAQs.slice(0, 5) },
    { header: "Swine Housing", questions: filteredFAQs.slice(5, 10) },
    {
      header: "Pagkain at Nutrisyon bagong walay",
      questions: filteredFAQs.slice(10, 15),
    },
    {
      header: "Kalusugan at Pag-iwas sa Sakit (Biik)",
      questions: filteredFAQs.slice(15, 20),
    },
    {
      header: "Nutrisyon (Grower Stage)",
      questions: filteredFAQs.slice(20, 25),
    },
    {
      header: "Kalusugan at Pag-iwas sa Sakit (Grower Pigs)",
      questions: filteredFAQs.slice(25, 30),
    },
    {
      header: "Pagkain at Nutrisyon (Finisher Stage)",
      questions: filteredFAQs.slice(30, 35),
    },
    {
      header: "Paglaki at Paghahanda para sa Merkado",
      questions: filteredFAQs.slice(35, 40),
    },
  ].filter((group) => group.questions.length > 0); // Remove empty groups

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hi, how can we help?</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search FAQs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* No Results Message */}
      {filteredFAQs.length === 0 ? (
        <Text style={styles.noResultsText}>No results found</Text>
      ) : (
        groupedFAQs.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.groupContainer}>
            {/* Group Header */}
            <Text style={styles.groupHeader}>{group.header}</Text>
            {group.questions.map((item, index) => (
              <FAQItem
                key={`${groupIndex}-${index}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default FAQScreen;
