"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, TextInput, Modal, Select } from "@mantine/core";
import NavBar from "../../components/NavBar";

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const PantryDetails = () => {
  const params = useParams();
  const id = params.id;

  const [ingredients, setIngredients] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    foodName: "",
    quantity: "",
    expiryDate: null,
    shelfLife: "",
    calories: "",
    foodGroup: "",
  });
  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  // Fetch ingredients from the pantry
  const fetchIngredients = async () => {
    if (id) {
      try {
        console.log("Fetching ingredients for pantry ID:", id);
        const response = await fetch(`/api/pantry/${id}/ingredients`);

        if (!response.ok) {
          throw new Error("Failed to fetch ingredients");
        }

        const data = await response.json();
        setIngredients(data.data || []);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        setAlertModal({ open: true, message: "Failed to load ingredients." });
      }
    }
  };

  // Fetch food items with their details from the database
  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/fooditems");
      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }
      const data = await response.json();
      setFoodItems(data.data || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
      setAlertModal({ open: true, message: "Failed to load food items." });
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchFoodItems(); // Fetch food items from API
  }, [id]);

  const handleFoodNameChange = (value) => {
    const selectedFood = foodItems.find((item) => item.FOODNAME === value);

    if (selectedFood) {
      const today = new Date();
      const calculatedExpiryDate = addDays(today, selectedFood.SHELFLIFE);

      setNewIngredient({
        ...newIngredient,
        foodName: selectedFood.FOODNAME,
        expiryDate: calculatedExpiryDate,
        shelfLife: selectedFood.SHELFLIFE,
        calories: selectedFood.CALORIES,
        foodGroup: selectedFood.FOODGROUP,
      });
    }
  };

  const handleAddIngredient = async () => {
    const { foodName, quantity, expiryDate, shelfLife, calories, foodGroup } =
      newIngredient;

    // Check if all fields are filled
    if (!foodName || !quantity || !expiryDate || !shelfLife || !calories) {
      setAlertModal({
        open: true,
        message: "Please fill in all fields before submitting.",
      });
      return;
    }

    // Validate expiry date
    const today = new Date();
    if (expiryDate <= today) {
      setAlertModal({
        open: true,
        message: "Expiry date must be after today.",
      });
      return;
    }

    try {
      const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
      const response = await fetch("/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PantryID: id,
          FoodName: foodName,
          Quantity: parseInt(quantity, 10),
          ExpiryDate: formattedExpiryDate,
          ShelfLife: shelfLife,
          Calories: parseInt(calories, 10),
          FoodGroup: foodGroup,
        }),
      });

      if (response.ok) {
        setNewIngredient({
          foodName: "",
          quantity: "",
          expiryDate: null,
          shelfLife: "",
          calories: "",
          foodGroup: "",
        });
        setOpenIngredientModal(false);
        fetchIngredients();
        setAlertModal({
          open: true,
          message: "Ingredient added successfully!",
        });
      } else {
        throw new Error("Failed to add ingredient");
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
      setAlertModal({ open: true, message: "Failed to add ingredient." });
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Pantry Ingredients</h1>
      <Button onClick={() => setOpenIngredientModal(true)}>Add Ingredient</Button>
      <Modal
        opened={openIngredientModal}
        onClose={() => setOpenIngredientModal(false)}
        title="Add New Ingredient"
      >
        <Select
          label="Food Name"
          placeholder="Select food name"
          value={newIngredient.foodName}
          onChange={handleFoodNameChange}
          data={foodItems.map((item) => ({
            value: item.FOODNAME,
            label: item.FOODNAME,
          }))}
        />
        <TextInput
          label="Quantity"
          placeholder="Enter quantity"
          value={newIngredient.quantity}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, quantity: e.currentTarget.value })
          }
        />
        <TextInput
          label="Expiry Date"
          placeholder="Expiry date"
          value={
            newIngredient.expiryDate
              ? newIngredient.expiryDate.toLocaleDateString()
              : ""
          }
          disabled
        />
        <TextInput
          label="Calories"
          placeholder="Calories"
          value={newIngredient.calories}
          disabled
        />
        <TextInput
          label="Food Group"
          placeholder="Food group"
          value={newIngredient.foodGroup}
          disabled
        />
        <Button onClick={handleAddIngredient}>Submit</Button>
      </Modal>
      <Modal
        opened={alertModal.open}
        onClose={() => setAlertModal({ open: false, message: "" })}
        title="Notification"
      >
        <div>{alertModal.message}</div>
        <Button onClick={() => setAlertModal({ open: false, message: "" })}>
          Close
        </Button>
      </Modal>
      <ul className="ingredients-list">
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>
              <p>
                <strong>Food Name:</strong> {ingredient.FOODNAME}
              </p>
              <p>
                <strong>Quantity:</strong> {ingredient.QUANTITY}
              </p>
              <p>
                <strong>Date Added:</strong>{" "}
                {new Date(ingredient.DATEADDED).toLocaleDateString()}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {new Date(ingredient.EXPIRYDATE).toLocaleDateString()}
              </p>
            </li>
          ))
        ) : (
          <div>
            <p>No ingredients found in this pantry.</p>
            <p>Click "Add Ingredient" to start populating your pantry!</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PantryDetails;