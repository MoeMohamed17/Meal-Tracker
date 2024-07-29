import "../recipes/Recipes.css"

const Recipe = ({ name, level, cuisine, time, image }) => {
  return (    
    <div className='recipe-container'>
        <div className='recipe-card'>
          <img src={image} alt={name} className="recipe-image" />
          <div className='recipe-description'>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Level:</strong> {level}</p>
          </div>

          <div className='recipe-info'>
            <p><strong>Cuisine:</strong> {cuisine}</p>
            <p><strong>Time:</strong> {time}</p>
          </div>
        </div>
    </div>
  );
}

export default Recipe