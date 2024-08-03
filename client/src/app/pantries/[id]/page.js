
"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar'; // Adjust the path if necessary

const PantryDetails = () => {
  const params = useParams();
  const id = params.id;

  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Pantry ID:", id); // Debug log to check if ID is retrieved correctly
    if (id) {
      const fetchIngredients = async () => {
        try {
          const response = await fetch(`/api/pantry/${id}/ingredients`);
          console.log("API Response Status:", response.status); // Check response status

          if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
          }

          const data = await response.json();
          console.log("Fetched Ingredients Data:", data); // Log data to see structure

          setIngredients(data.data);
        } catch (error) {
          console.error('Error fetching ingredients:', error);
          setError('Failed to load ingredients.');
        }
      };

      fetchIngredients();
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!ingredients.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <h1>Pantry Ingredients</h1>
      <ul className="ingredients-list">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <p><strong>Food Name:</strong> {ingredient.FOODNAME}</p>
            <p><strong>Quantity:</strong> {ingredient.QUANTITY}</p>
            <p><strong>Date Added:</strong> {new Date(ingredient.DATEADDED).toLocaleDateString()}</p>
            <p><strong>Expiry Date:</strong> {new Date(ingredient.EXPIRYDATE).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PantryDetails;

