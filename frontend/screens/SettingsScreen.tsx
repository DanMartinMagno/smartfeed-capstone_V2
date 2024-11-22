import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const settingsOptions = [
    {
      title: "Edit Account",
      icon: "person-outline",
      onPress: () => navigation.navigate("EditAccount"),
    },
    {
      title: "Change Password",
      icon: "key-outline",
      onPress: () => navigation.navigate("ChangePassword"),
    },
    {
      title: "Logout",
      icon: "log-out-outline",
      onPress: handleLogout,
    },
  ];

  const fullName = user
    ? `${user.firstName} ${user.middleInitial || ""} ${user.lastName}`.trim()
    : "";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {user ? (
            <>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading user info...</Text>
          )}
        </View>

        <View style={styles.list}>
          {settingsOptions.map((option, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                style={styles.cardContent}
                onPress={option.onPress}
              >
                <Icon
                  name={option.icon}
                  size={24}
                  color="#000"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemText}>{option.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SmartFeed</Text>
        <Text style={styles.footerDescription}>
          SmartFeed is currently under development and testing phase. We're
          working on improving features to provide the best experience for swine
          raisers
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    flex: 1,
    backgroundColor: "#f2f6f9",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for footer
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 15,
    color: "#777",
  },
  loadingText: {
    fontSize: 16,
    color: "#777",
  },
  list: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#f2f6f9",
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
