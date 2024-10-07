import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation } from "react-native";
import { styles } from "../styles/faqScreen_styles";
import { Ionicons } from "@expo/vector-icons";

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
    <View>
      <TouchableOpacity
        onPress={toggleOpen}
        style={[styles.itemContainer, isOpen && styles.activeItem]}
      >
        <View style={styles.row}>
          {/* Wrap text in <Text> */}
          <Text style={[styles.question, isOpen && styles.activeQuestion]}>
            {question}
          </Text>
          {/* Icon should not cause this error, but ensure it's placed inside a <View> or inline with Text */}
          <Ionicons
            name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
            size={24}
            color={isOpen ? "#4CAF50" : "#333"}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <Text style={styles.answer}>
          {answer} {/* Ensure this is inside a <Text> */}
        </Text>
      )}

      <View style={styles.separator} />
    </View>
  );
};

export default FAQItem;
