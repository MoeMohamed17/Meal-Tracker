import pastaImage from '../assets/pasta.jpg'
import lasagnaImage from '../assets/lasagna.png'
import NavBar from '../components/NavBar'

const Recipe = () => {

  const elements = [
    {
      name: 'pasta',
      cuisine: 'italian',
      level: 3,
      time: '30 minutes',
      image: pastaImage
    },

    {
      name: 'lasagna',
      cuisine: 'italian',
      level: 4,
      time: '40 minutes',
      image: lasagnaImage
    }
  ];

  return (    
    <div className='recipe-container'>
      {elements.map((recipe, index) => (
        <div>
          <img src={recipe.image} alt={recipe.name} className="recipe-name" />
          <div>
            <p><strong>Name:</strong> {recipe.name}</p>
            <p><strong>Level:</strong> {recipe.level}</p>
          </div>

          <div>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Time:</strong> {recipe.time}</p>
          </div>
        </div>
      ))}

    </div>
  );
}

export default Recipe