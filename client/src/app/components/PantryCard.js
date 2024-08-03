
import React from 'react';
import Link from 'next/link';
import '../pantries/Pantries.css'; // Ensure you have styles for this component

const PantryCard = ({ pantryId, category }) => {
  return (
    <Link href={`/pantries/${pantryId}`} passHref>
      <div className="pantry-card">
        <h3>{category}</h3>
        {/* Add more details about the pantry as needed */}
      </div>
    </Link>
  );
};


export default PantryCard;
