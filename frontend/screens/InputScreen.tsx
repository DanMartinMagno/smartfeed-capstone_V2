import React, { useState } from "react";
import { View, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setNumSwine, setSelectedIngredients } from "../store/feedSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import {
  Card,
  Text,
  TextInput,
  Button,
  Checkbox,
  HelperText,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/InputScreen_styles";

type InputScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Input"
>;

type Props = {
  navigation: InputScreenNavigationProp;
};

const MAX_INGREDIENTS = 10;
const MAX_SWINE = 100;

const InputScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.feed.type);
  const [numSwine, setNumSwineState] = useState("");
  const [selectedIngredients, setSelectedIngredientsState] = useState<
    { ingredient: string; amount: number }[]
  >([]); // Updated type to array of objects
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ingredients = [
    { name: "Coconut Residue", icon: "food-apple" },
    { name: "Water Spinach", icon: "leaf" },
    { name: "Sweet Potato Leaves", icon: "corn" },
    { name: "Cassava Leaves", icon: "leaf" },
    { name: "Banana Pseudostem", icon: "food-apple" },
    { name: "Duckweed Fern", icon: "leaf" },
    { name: "Lead Tree Leaves", icon: "tree" },
    { name: "Taro Leaves", icon: "leaf" },
    { name: "Madre De Agua Leaves", icon: "leaf" },
    { name: "Water Hyacinth Leaves", icon: "water" },
    { name: "Rice Bran", icon: "grain" },
  ];

  const toggleIngredient = (ingredientName: string) => {
    const isSelected = selectedIngredients.some(
      (ingredient) => ingredient.ingredient === ingredientName
    );

    if (isSelected) {
      // Remove the ingredient if already selected
      setSelectedIngredientsState((prev) =>
        prev.filter((i) => i.ingredient !== ingredientName)
      );
      setErrorMessage(null);
    } else {
      if (selectedIngredients.length >= MAX_INGREDIENTS) {
        setErrorMessage(
          `You can select a maximum of ${MAX_INGREDIENTS} ingredients.`
        );
        return;
      }

      // Add the ingredient with a default amount of 0
      setSelectedIngredientsState((prev) => [
        ...prev,
        { ingredient: ingredientName, amount: 0 },
      ]);
      setErrorMessage(null);
    }
  };

  const handleSubmit = () => {
    if (selectedIngredients.length < 2) {
      setErrorMessage("Please select at least 2 ingredients.");
      return;
    }

    const numSwineInt = parseInt(numSwine, 10);
    if (
      !numSwine ||
      isNaN(numSwineInt) ||
      numSwineInt <= 0 ||
      numSwineInt > MAX_SWINE
    ) {
      setErrorMessage(
        `Please enter a valid number of swine between 1 and ${MAX_SWINE}.`
      );
      return;
    }

    setErrorMessage(null);
    dispatch(setNumSwine(numSwineInt));
    dispatch(setSelectedIngredients(selectedIngredients));
    navigation.navigate("Result", {
      type,
      numSwine: numSwineInt,
      selectedIngredients,
    });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Feed Formulation</Text>
        <Card style={styles.card}>
          <Card.Title title={`Feeds for ${type}`} />
          <Card.Content>
            <TextInput
              label="Number of Swine"
              value={numSwine}
              onChangeText={setNumSwineState}
              keyboardType="numeric"
              mode="outlined"
              placeholderTextColor="#9E9E9E"
              autoComplete="off"
              error={
                !!errorMessage &&
                (isNaN(parseInt(numSwine, 10)) ||
                  parseInt(numSwine, 10) <= 0 ||
                  parseInt(numSwine, 10) > MAX_SWINE)
              }
              style={styles.input}
              theme={{
                colors: {
                  primary: "green",
                  placeholder: "#9E9E9E",
                },
              }}
            />
            <HelperText
              type="error"
              visible={
                !!errorMessage &&
                (isNaN(parseInt(numSwine, 10)) ||
                  parseInt(numSwine, 10) <= 0 ||
                  parseInt(numSwine, 10) > MAX_SWINE)
              }
            >
              {errorMessage}
            </HelperText>
          </Card.Content>
        </Card>

        <Text style={styles.subHeader}>
          Select Ingredients ({selectedIngredients.length}/{MAX_INGREDIENTS})
        </Text>
        {ingredients.map((ingredient) => (
          <TouchableWithoutFeedback
            key={ingredient.name}
            onPress={() => toggleIngredient(ingredient.name)}
          >
            <View>
              <Card style={styles.ingredientCard}>
                <View style={styles.checkboxContainer}>
                  <View style={styles.iconTextContainer}>
                    <View style={styles.iconBackground}>
                      <MaterialCommunityIcons
                        name={ingredient.icon}
                        size={24}
                        color="green"
                      />
                    </View>
                    <Text>{ingredient.name}</Text>
                  </View>
                  <Checkbox
                    status={
                      selectedIngredients.some(
                        (item) => item.ingredient === ingredient.name
                      )
                        ? "checked"
                        : "unchecked"
                    }
                    color="green"
                  />
                </View>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        ))}

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <TouchableWithoutFeedback onPress={handleSubmit}>
          <View>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              color="green"
            >
              Formulate
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
};

export default InputScreen;
