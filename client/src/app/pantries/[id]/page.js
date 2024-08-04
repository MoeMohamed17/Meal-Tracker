"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, TextInput, Modal, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import NavBar from '../../components/NavBar';

const PantryDetails = () => {
  const params = useParams();
  const id = params.id;

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    foodName: '',
    quantity: '',
    expiryDate: null,
    shelfLife: '',
    calories: '',
    foodGroup: '',
  });
  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: '' });

  const fetchIngredients = async () => {
    if (id) {
      try {
        console.log("Fetching ingredients for pantry ID:", id);
        const response = await fetch(`/api/pantry/${id}/ingredients`);

        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }

        const data = await response.json();
        setIngredients(data.data || []);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setAlertModal({ open: true, message: 'Failed to load ingredients.' });
      }
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [id]);

  const handleAddIngredient = async () => {
    const { foodName, quantity, expiryDate, shelfLife, calories, foodGroup } = newIngredient;

    if (!foodName || !quantity || !expiryDate || !shelfLife || !calories || !foodGroup) {
      setAlertModal({ open: true, message: 'Please fill in all fields before submitting.' });
      return;
    }

    try {
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
      const response = await fetch('/api/ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          foodName: '',
          quantity: '',
          expiryDate: null,
          shelfLife: '',
          calories: '',
          foodGroup: '',
        });
        setOpenIngredientModal(false);
        fetchIngredients();
        setAlertModal({ open: true, message: 'Ingredient added successfully!' });
      } else {
        throw new Error('Failed to add ingredient');
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      setAlertModal({ open: true, message: 'Failed to add ingredient.' });
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
        <TextInput
          label="Food Name"
          placeholder="Enter food name"
          value={newIngredient.foodName}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, foodName: e.currentTarget.value })
          }
        />
        <TextInput
          label="Quantity"
          placeholder="Enter quantity"
          value={newIngredient.quantity}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, quantity: e.currentTarget.value })
          }
        />
        <DatePicker
          label="Expiry Date"
          placeholder="Select expiry date"
          value={newIngredient.expiryDate}
          onChange={(date) => setNewIngredient({ ...newIngredient, expiryDate: date })}
        />
        <TextInput
          label="Shelf Life"
          placeholder="Enter shelf life"
          value={newIngredient.shelfLife}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, shelfLife: e.currentTarget.value })
          }
        />
        <TextInput
          label="Calories"
          placeholder="Enter calories"
          value={newIngredient.calories}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, calories: e.currentTarget.value })
          }
        />
        <Select
          label="Food Group"
          placeholder="Select food group"
          value={newIngredient.foodGroup}
          onChange={(value) =>
            setNewIngredient({ ...newIngredient, foodGroup: value })
          }
          data={[
            { value: 'Fruits', label: 'Fruits' },
            { value: 'Vegetables', label: 'Vegetables' },
            { value: 'Grains', label: 'Grains' },
            { value: 'Protein Foods', label: 'Protein Foods' },
            { value: 'Dairy', label: 'Dairy' },
            { value: 'Legumes', label: 'Legumes' },
            { value: 'Others', label: 'Others' },
          ]}
        />
        <Button onClick={handleAddIngredient}>Submit</Button>
      </Modal>
      <Modal
        opened={alertModal.open}
        onClose={() => setAlertModal({ open: false, message: '' })}
        title="Notification"
      >
        <div>{alertModal.message}</div>
        <Button onClick={() => setAlertModal({ open: false, message: '' })}>Close</Button>
      </Modal>
      <ul className="ingredients-list">
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>
              <p><strong>Food Name:</strong> {ingredient.FOODNAME}</p>
              <p><strong>Quantity:</strong> {ingredient.QUANTITY}</p>
              <p><strong>Date Added:</strong> {new Date(ingredient.DATEADDED).toLocaleDateString()}</p>
              <p><strong>Expiry Date:</strong> {new Date(ingredient.EXPIRYDATE).toLocaleDateString()}</p>
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
