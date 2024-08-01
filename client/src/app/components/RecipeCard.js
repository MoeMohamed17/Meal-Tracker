// import "../recipes/Recipes.css"

// const Recipe = ({ name, level, cuisine, time, image }) => {
//   return (    
//     <div className='recipe-container'>
//         <div className='recipe-card'>
//           <img src={image} alt={name} className="recipe-image" />
//           <div className='recipe-description'>
//             <p><strong>Name:</strong> {name}</p>
//             <p><strong>Level:</strong> {level}</p>
//           </div>

//           <div className='recipe-info'>
//             <p><strong>Cuisine:</strong> {cuisine}</p>
//             <p><strong>Time:</strong> {time}</p>
//           </div>
//         </div>
//     </div>
//   );
// }

// export default Recipe;

import React from 'react';
import Link from 'next/link';
//import './RecipeCard.css';
import "../recipes/Recipes.css"

const RecipeCard = ({ id, name, cuisine, level, time, createdBy }) => {
    return (
        <Link href={`/recipe/${id}`} passHref>
            <div className="recipe-card">
                <h2>{name}</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Level:</strong> {level}</p>
                <p><strong>Cuisine:</strong> {cuisine}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Created By:</strong> {createdBy}</p>
            </div>
        </Link>
    );
};

export default RecipeCard;
