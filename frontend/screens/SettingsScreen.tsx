import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      {/* Settings List */}
      <View style={styles.list}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.listItem}>
            <Icon
              name={option.icon}
              size={24}
              color="#000"
              style={styles.itemIcon}
            />
            <Text style={styles.itemText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SmartFeed</Text>
        <Text style={styles.footerDescription}>
          SmartFeed is currently under development and testing phase. We're
          working on improving features to provide the best experience for
          swine raisers
        </Text>
      </View>
    </ScrollView>
  );
};

// List of settings options

const settingsOptions = [
  { title: "Language", icon: "language-outline" },
  { title: "Notifications", icon: "notifications-outline" },
  { title: "Privacy", icon: "lock-closed-outline" },
  { title: "Terms & Conditions", icon: "document-text-outline" },
  { title: "Security", icon: "key-outline" },
  { title: "Ads", icon: "megaphone-outline" },
  { title: "Account", icon: "person-circle-outline" },
  { title: "Help", icon: "help-circle-outline" },
  { title: "About", icon: "information-circle-outline" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6f9",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    marginHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerDescription: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
});

export default SettingsScreen;
