"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, TextInput, Modal, Select } from "@mantine/core";
import NavBar from "../../components/NavBar";

//Add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

//list of food items 
const foodItemList = [
  {
    value: "Chicken",
    label: "Chicken",
    shelfLife: 3,
    calories: 300,
    foodGroup: "Protein Foods",
  },
  {
    value: "Potatoes",
    label: "Potatoes",
    shelfLife: 14,
    calories: 200,
    foodGroup: "Vegetables",
  },
  {
    value: "Olive Oil",
    label: "Olive Oil",
    shelfLife: 3650,
    calories: 400,
    foodGroup: "Others",
  },
  {
    value: "Uncooked Rice",
    label: "Uncooked Rice",
    shelfLife: 3650,
    calories: 400,
    foodGroup: "Grains",
  },
  {
    value: "Uncooked Noodles",
    label: "Uncooked Noodles",
    shelfLife: 3650,
    calories: 300,
    foodGroup: "Grains",
  },
  {
    value: "Butter",
    label: "Butter",
    shelfLife: 90,
    calories: 500,
    foodGroup: "Dairy",
  },
  {
    value: "Ground Beef",
    label: "Ground Beef",
    shelfLife: 3,
    calories: 400,
    foodGroup: "Protein Foods",
  },
  {
    value: "Sliced Ham",
    label: "Sliced Ham",
    shelfLife: 4,
    calories: 300,
    foodGroup: "Protein Foods",
  },
];

const PantryDetails = () => {
  const params = useParams();
  const id = params.id;

  const [ingredients, setIngredients] = useState([]);
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

  useEffect(() => {
    fetchIngredients();
  }, [id]);

  const handleFoodNameChange = (value) => {
    const selectedFood = foodItemList.find((item) => item.value === value);

    if (selectedFood) {
      const today = new Date();
      const calculatedExpiryDate = addDays(today, selectedFood.shelfLife);

      setNewIngredient({
        ...newIngredient,
        foodName: selectedFood.value,
        expiryDate: calculatedExpiryDate,
        shelfLife: selectedFood.shelfLife,
        calories: selectedFood.calories,
        foodGroup: selectedFood.foodGroup,
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
          data={foodItemList}
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
          value={newIngredient.expiryDate ? newIngredient.expiryDate.toLocaleDateString() : ''}
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
