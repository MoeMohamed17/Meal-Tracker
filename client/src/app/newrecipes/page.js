//where users can contribute to making and posting a new recipe

import RecipeForm from "../components/RecipeForm";
import NavBar from "../components/NavBar";

const NewRecipe = () => {
    return (
        <div>
            <NavBar />
            <RecipeForm />
        </div>
    )
}

export default NewRecipe;
