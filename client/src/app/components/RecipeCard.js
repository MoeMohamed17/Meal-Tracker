import "../recipes/Recipes.css";
import Link from 'next/link';
import { ActionIcon, Image, Paper, Title, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel'
import { IconHeart } from '@tabler/icons-react';
import '@mantine/carousel/styles.css';

const blackOutline = {
  textShadow: `
    -1px -1px 0 #000, 
    1px -1px 0 #000, 
    -1px 1px 0 #000, 
    1px 1px 0 #000
  `,
  color: 'black',
};

function Card({ image, title, category }) {
  return (
    <Paper 
      shadow="md" 
      p="xl" 
      radius="md" 
      style={{ position: 'relative', width: '100%', height: '250px', color: 'white' }}
    >
      <img 
        src={image}
        alt={title}
        style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      />
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        <div style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}>
          {category}
        </div>
        <Title order={3} style={{ color: 'white', marginTop: '10px', textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}>
          {title}
        </Title>
      </div>
    </Paper>
  );
}

const RecipeCard = ({ id, name, level, cuisine, time, imageUrl, caption, liked, callback }) => {
  const slides = imageUrl.map((url, index) => (
    <Carousel.Slide key={url}>
      {/* <Image src={url} className="recipe-image"/> */}
      <Card
        image={url}
        title={caption[index]}
        category={cuisine}
      />
    </Carousel.Slide>
  ));
  return (
    <div className="recipe-container">
      <ActionIcon 
        variant={liked ? "primary" : "light"}
        onClick={() => {callback(id);}}
        className="recipe-heart">
        <IconHeart size={20} stroke={2} />
      </ActionIcon>
      <div className="recipe-card">
        <Carousel withIndicators>{slides}</Carousel>
        <Link href={`/recipes/${id}`} style={{textDecoration: 'none', color: '#3B3C36'}} passHref>
          <div className="recipe-description">
            <p>
              <Title order={2}>{name}</Title> 
            </p>
            <p>
              <strong>Level:</strong> {level}
            </p>
            {/* {caption && <p><strong>Caption:</strong> {caption}</p>} */}
          </div>

          <div className="recipe-info">
            <p>
              {/* <strong>Cuisine:</strong> {cuisine} */}
            </p>
            <p>
              <strong>Time:</strong> {time}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;



