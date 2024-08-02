
// src/app/components/PantryCard.js
import React from 'react';
import '../pantries/Pantries.css'; // Ensure you have styles for this component

const PantryCard = ({ category }) => {
  return (
    <div className="pantry-card">
      <h3>{category}</h3>
      {/* Add more details about the pantry as needed */}
    </div>
  );
};

export default PantryCard;



