import "../recipes/Recipes.css";
import Link from 'next/link';
import { ActionIcon } from "@mantine/core";
import { IconHeart } from '@tabler/icons-react';


const RecipeCard = ({ id, name, level, cuisine, time, imageUrl, caption, liked, callback }) => {
  return (
    <div className="recipe-container">
      <ActionIcon 
        variant={liked ? "primary" : "light"}
        onClick={() => {callback(id);}}
        className="recipe-heart">
        <IconHeart size={20} stroke={2} />
      </ActionIcon>
      <Link href={`/recipes/${id}`} passHref className="recipe-card">
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
      </Link>
    </div>
  );
};

export default RecipeCard;



