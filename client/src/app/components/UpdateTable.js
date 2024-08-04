import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, Radio, Button } from '@mantine/core';
import styles from './Table.css';

const UpdateTable = ({ recipes }) => {
  const [selectedID, setSelectedID] = useState(null);

  const handleRadioChange = (recipeId) => {
    setSelectedID(recipeId);
  };

  const rows = recipes.map((recipe) => (
    <Table.Tr key={recipe.RECIPEID}>
      <Table.Td>
        <Radio
          value={recipe.RECIPEID}
          checked={selectedID === recipe.RECIPEID}
          onChange={() => handleRadioChange(recipe.RECIPEID)}
          name="recipe"
        />
      </Table.Td>
      <Table.Td>{recipe.RECIPEID}</Table.Td>
      <Table.Td>{recipe.RECIPENAME}</Table.Td>
      <Table.Td>{recipe.CUISINE}</Table.Td>
      <Table.Td>{recipe.COOKINGTIME}</Table.Td>
      <Table.Td>{recipe.RECIPELEVEL}</Table.Td>
      <Table.Td>{recipe.USERNAME}</Table.Td>
      <Table.Td>{recipe.USERID}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Select</Table.Th>
            <Table.Th>RecipeID</Table.Th>
            <Table.Th>RecipeName</Table.Th>
            <Table.Th>RecipeCuisine</Table.Th>
            <Table.Th>CookingTime</Table.Th>
            <Table.Th>RecipeLevel</Table.Th>
            <Table.Th>UserName</Table.Th>
            <Table.Th>UserID</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>


      {recipes.length > 0 ? (
        <div style={{ position: 'relative', top: '20px', left: '20px' }}>
          <Link href={`/myrecipes/${selectedID}`} passHref>
            <Button>
              Inspect
            </Button>
          </Link>
        </div>
      ) :
      (<div>No recipes found.</div>)}
    
    </div>
  );
};

export default UpdateTable;