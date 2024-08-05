
import React from 'react';
import Link from 'next/link';
import '../pantries/Pantries.css';

const PantryCard = ({ pantryId, category }) => {
  return (
    <Link href={`/pantries/${pantryId}`} passHref>
      <div className="pantry-card">
        <h3>{category}</h3>
      </div>
    </Link>
  );
};


export default PantryCard;
