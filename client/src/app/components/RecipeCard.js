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


// // src/app/components/RecipeCard.js
// import "../recipes/Recipes.css";
// import Link from 'next/link';

// const RecipeCard = ({ id, name, level, cuisine, time, image }) => {
//   return (
//     <Link href={`/recipes/${id}`} passHref>
//       <div className="recipe-container">
//         <div className="recipe-card">
//           <img src={image} alt={name} className="recipe-image" />
//           <div className="recipe-description">
//             <p>
//               <strong>Name:</strong> {name}
//             </p>
//             <p>
//               <strong>Level:</strong> {level}
//             </p>
//           </div>

//           <div className="recipe-info">
//             <p>
//               <strong>Cuisine:</strong> {cuisine}
//             </p>
//             <p>
//               <strong>Time:</strong> {time}
//             </p>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default RecipeCard;


// src/app/components/RecipeCard.js
import "../recipes/Recipes.css";
import Link from 'next/link';

const RecipeCard = ({ id, name, level, cuisine, time, imageUrl, caption }) => {
  return (
    <Link href={`/recipes/${id}`} passHref>
      <div className="recipe-container">
        <div className="recipe-card">
          <img src={imageUrl} alt={name} className="recipe-image" />
          <div className="recipe-description">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Level:</strong> {level}
            </p>
            {caption && <p><strong>Caption:</strong> {caption}</p>}
          </div>

          <div className="recipe-info">
            <p>
              <strong>Cuisine:</strong> {cuisine}
            </p>
            <p>
              <strong>Time:</strong> {time}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;



