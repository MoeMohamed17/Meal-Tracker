const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

/* 
API test endpoint
*/
router.get('/test', async (req, res) => {
    res.send("Hello world!");
});



/*================================================
=================RECIPE ENDPOINTS=================
================================================*/
/*
API endpoint to GET recipe and attached images
Example of usage:
...await fetch('/api/recipes?img=<anything>');
    Fetches recipes with images 

...await fetch('/api/recipes?img=<anything>&captionless=1');
    Fetches recipes with images but no captions

...await fetch('/api/recipes?columns=r.Username,r.Cuisine&img=<anything>');
    Fetches recipes but with only username, cuisine attributes and with images

...await fetch('/api/recipes?columns=r.Username,r.Cuisine&img=<anything>');
    Fetches recipes but with only recipeID, username, cuisine attributes and with images

...await fetch('/api/recipes?columns=r.RecipeLevels&filter=Greek,img=<anything>');
    Fetches recipes but with only recipeID, username, cuisine attributes and with images, filtering for Greek cuisine

...await fetch('/api/recipes?id=3');
    Fetches recipe with id 3, no images

TODO: figure out how to apply more than just the cuisine filter
*/
router.get('/recipes', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const filter = req.query.filter || null;
    const id = req.query.id || null;
    const img = req.query.img;
    const captionless = req.query.captionless;
    const user = req.query.user || null;
    const recipes = await appService.fetchRecipes(columns, filter, id, img, captionless, user);
    if (recipes.length === 0) {
        res.status(404).json({ error: 'No recipes found' });
    } else {
        res.json({ data: recipes });
    }
});

/*
API endpoint to GET a single recipe by ID
*/
router.get('/recipe/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const recipe = await appService.fetchRecipeByID(RecipeID);
    if (recipe.length === 0) {
        res.status(404).json({ error: 'Recipe not found' });
    } else {
        res.json({ data: recipe });
    }
});

/*
API endpoint to GET all liked recipes
*/
router.get('/recipes/liked', async (req, res) => {
    const recipes = await appService.fetchLikedRecipes();
    if (recipes.length === 0) {
        res.status(404).json({ error: 'No liked recipes found' });
    } else {
        res.json({ data: recipes });
    }
});

/*
API endpoint to GET liked recipes liked by user
*/
router.get('/recipes/liked/:id', async (req, res) => {
    const UserID = req.params.id;
    const recipes = await appService.fetchUserLikedRecipes(UserID);
    if (recipes.length === 0) {
        res.status(404).json({ error: 'No liked recipes found' });
    } else {
        res.json({ data: recipes });
    }
});

/*
API endpoint to LIKE a recipe
*/
router.post('/likeRecipe', async (req, res) => {
    const info = req.body;
    const reply = await appService.UserLikedRecipe(info);
    if (reply.length === 0) {
        res.status(404).json({ error: 'Liking unsuccessful' });
    } else {
        res.json({ data: reply });
    }
});

/*
API endpoint to UNLIKE a recipe
*/
router.post('/unlikeRecipe', async (req, res) => {
    const info = req.body;
    const reply = await appService.UserUnlikedRecipe(info);
    if (reply.length === 0) {
        res.status(404).json({ error: 'Unliking unsuccessful' });
    } else {
        res.json({ data: reply });
    }
});

/*
API endpoint to CREATE a new recipe
Pass in a dictionary containing necessary inputs
e.g. {  'RecipeName': 'Pasta Verde', 
        'Cuisine': 'Italian', 
        'CookingTime': '00 00:30:00',
        'UserID': 3}

Be sure to retrieve RecipeID in response, use that to call steps endpoint
*/
router.post('/recipe', async (req, res) => {
    const recipe = req.body;
    const response = await appService.createRecipe(recipe);
    if (response) {
        res.status(201).json({ message: 'Recipe created', response });
    } else {
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

/*
API endpoint to GET steps for a specific recipe by ID
*/
router.get('/recipe/:id/steps', async (req, res) => {
    const RecipeID = req.params.id;
    const steps = await appService.fetchRecipeSteps(RecipeID);
    if (steps.length === 0) {
        res.status(404).json({ error: 'No steps found for this recipe' });
    } else {
        res.json({ data: steps });
    }
});

/* 
API endpoint to GET RecipeLevels (Cuisine, RecipeLevel)
*/
router.get('/recipelevels', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchRecipeLevels(columns);
    res.json({data: tableContent});
});


/*
API endpoint to GET cuisine options
*/
router.get('/cuisines', async (req, res) => {
    const cuisines = await appService.fetchCuisineOptions();
    if (cuisines.length === 0) {
        res.status(404).json({ error: 'No cuisines found' });
    } else {
        res.json({ data: cuisines });
    }
});

/*================================================
==================IMAGE ENDPOINTS=================
================================================*/
/*
API endpoint to GET all images and captions associated with RecipeID
*/
router.get('/images/:id', async (req, res) => {
    const captionless = req.query.captionless == 1;
    const RecipeID = req.params.id;
    const images = await appService.fetchImagesByID(RecipeID, captionless);
    if (images.length === 0) {
        res.status(404).json({ error: 'Images not found' });
    } else {
        res.json({ data: images });
    }
});

/*
API endpoint to insert multiple images associated with a recipe

*/
router.post('/images/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const ImageURL = req.body.ImageURL;
    const Caption = req.body.Caption;
    let success = true; 

    for (let i = 0; i < ImageURL.length; i++) {
        const response = await appService.insertImage(RecipeID, ImageURL[i], Caption[i]);
        console.log(response);
        if (!response) {
            success = false;
            break;
        }
    }

    if (success) {
        res.status(201).json({ message: 'Images inserted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to insert all images' });
    }
});


/*
API endpoint to DELETE all images and captions associated with a recipe
*/
router.delete('/images/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const rowsAffected = await appService.deleteImages(RecipeID);
    if (rowsAffected > 0) {
        res.json({ message: 'Images deleted' });
    } else {
        res.status(404).json({ error: 'Images not found or not deleted' });
    }
});


/* 
API endpoint to GET all images
*/
router.get('/images', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllImages(columns);
    res.json({data: tableContent});
});

/*================================================
==================STEP ENDPOINTS==================
================================================*/
/*
API endpoint to insert steps associated with recipe

Note that this should never be run by itself. First, create a new recipe,
retrieve the RecipeID returned in the response, then call this endpoint
with the appropriate RecipeID.

At some point, should probably just fold this into the create recipe endpoint
as you can't have a recipe without steps, and vice versa...

steps value should be a list of strings corresponding to instructions
e.g., ['Preheat the oven to 350F', ...]
*/
router.post('/steps/:id', async (req, res) => {
    const recipeID = req.params.id;
    const steps = req.body.steps;
    let success = true; 

    for (let i = 0; i < steps.length; i++) {
        const response = await appService.insertStep(i + 1, steps[i], recipeID);
        console.log(response);
        if (!response) {
            success = false;
            break;
        }
    }

    if (success) {
        res.status(201).json({ message: 'Steps inserted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to insert all steps' });
    }
});


// const recipe = { ...req.body, RecipeID: RecipeID };
// const rowsAffected = await appService.updateRecipe(recipe);
// if (rowsAffected > 0) {
//     res.json({ message: 'Recipe updated' });
// } else {
//     res.status(404).json({ error: 'Recipe not found or not updated' });
// }
// });


/*
API endpoint to DELETE all steps associated with a recipe
*/
router.delete('/steps/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const rowsAffected = await appService.deleteSteps(RecipeID);
    if (rowsAffected > 0) {
        res.json({ message: 'Steps deleted' });
    } else {
        res.status(404).json({ error: 'Steps not found or not deleted' });
    }
});



//API endpoint to GET all steps for all recipes
router.get('/steps', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllSteps(columns);
    res.json({data: tableContent});
});



/*================================================
==================USER ENDPOINTS==================
================================================*/
/*
API endpoint to GET a user's UserID, Name, Points, and Rank
*/
router.get('/user/:id', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const UserID = req.params.id;
    const tableContent = await appService.fetchUser(UserID, columns);
    res.json({data: tableContent});
});

/* 
API endpoint to GET all users' UserID, Name, Points, and Rank
*/
router.get('/users', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllUsers(columns);
    res.json({data: tableContent});
});

/* 
API endpoint to GET all users' points and level
*/
router.get('/userlevels', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchUserLevels(columns);
    res.json({data: tableContent});
});


/*
API endpoint to CREATE a new user
Pass in a dictionary containing the name
e.g. {  'Username': 'Ford Prefect' }
*/
router.post('/user', async (req, res) => {
    const Username = req.body.UserName;
    const response = await appService.createUser(Username);
    if (response) {
        res.status(201).json({ message: 'User created', response });
    } else {
        res.status(500).json({ error: 'Failed to create new user' });
    }
});

/*
API endpoint to UPDATE points associated with a user
*/
router.put('/points/:id', async (req, res) => {
    const UserID = req.params.id;
    const response = await appService.updatePoints(UserID);
    if (response === 1) {
        res.status(201).json({ message: 'Points updated' });
    } else {
        res.status(500).json({ error: 'Failed to update points' });
    }
});


/*================================================
==================FOODITEM ENDPOINTS==============
================================================*/
/*
API endpoint to GET all food items of a specific recipe
*/
router.get('/recipe/:id/fooditems', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const recipeID = req.params.id;
    const response = await appService.fetchRecipeFoodItems(columns, recipeID);
    if (response.length === 0) {
        res.status(404).json({ error: 'No food items found for this recipe' });
    } else {
        res.json({ data: response });
    }
});

/*
API endpoint to GET all food items
*/
router.get('/fooditems', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllFoodItems(columns);
    res.json({data: tableContent});
});

/*
API endpoint to GET all healthy food items
*/
router.get('/healthyfooditems', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllHealthyFoodItems(columns);
    res.json({data: tableContent});
});

/*
API endpoint to GET all foods in all recipes
*/
router.get('/fooditemsinrecipes', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllFoodsInRecipes(columns);
    res.json({data: tableContent});
});





/*================================================
==================PANTRY ENDPOINTS=================
================================================*/
/*
API endpoint to GET all ingredient instances of a specific pantry
*/
// router.get('/pantry/:id/ingredients', async (req, res) => {
//     const pantryID = req.params.id;
//     const ingredientInstances = await appService.fetchIngredientInstances(pantryID);
//     if (ingredientInstances.length === 0) {
//         res.status(404).json({ error: 'No ingredients found for this pantry' });
//     } else {
//         res.json({ data: ingredientInstances });
//     }
// });

// API endpoint to GET all ingredient instances of a specific pantry
router.get('/pantry/:id/ingredients', async (req, res) => {
    const pantryID = req.params.id;
    try {
        const ingredientInstances = await appService.fetchIngredientInstances(pantryID);
        res.status(200).json({ data: ingredientInstances || [] });
    } catch (error) {
        console.error('Error in fetching ingredient instances:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/*
API endpoint to GET all ingredient instances in all pantries
*/
router.get('/ingredientinstances', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllIngredientInstances(columns);
    res.json({data: tableContent});
});


/*
API endpoint to GET a user's pantries
*/
router.get('/pantry/:id', async (req, res) => {
    const UserID = req.params.id;
    const tableContent = await appService.fetchPantries(UserID);
    res.json({data: tableContent});
});

/*
API endpoint to GET all pantries from all users
*/
router.get('/pantries', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchSavedPantries(columns);
    res.json({data: tableContent});
});

/*
API endpoint to GET all existing pantries
*/
router.get('/savedpantries', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllPantries(columns);
    res.json({data: tableContent});
});

// Add this endpoint to handle the creation of a new pantry
router.post('/pantry', async (req, res) => {
    const { UserID, Category } = req.body;
    const response = await appService.createPantry(UserID, Category);
    if (response) {
        res.status(201).json({ message: 'Pantry created', response });
    } else {
        res.status(500).json({ error: 'Failed to create pantry' });
    }
});



// endpoint to handle adding a new ingredient instance
router.post('/ingredient', async (req, res) => {
    const { PantryID, FoodName, Quantity, ExpiryDate, ShelfLife, Calories, FoodGroup } = req.body;
    const response = await appService.addIngredient(PantryID, FoodName, Quantity, ExpiryDate, ShelfLife, Calories, FoodGroup);
    if (response) {
      res.status(201).json({ message: 'Ingredient added', response });
    } else {
      res.status(500).json({ error: 'Failed to add ingredient' });
    }
  });
  



/*
API endpoint to UPDATE an existing recipe
*/
router.put('/recipe/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const recipe = { ...req.body, RecipeID: RecipeID };
    const rowsAffected = await appService.updateRecipe(recipe);
    if (rowsAffected > 0) {
        res.json({ message: 'Recipe updated' });
    } else {
        res.status(404).json({ error: 'Recipe not found or not updated' });
    }
});

/*
API endpoint to DELETE a recipe
*/
router.delete('/recipe/:id', async (req, res) => {
    const RecipeID = req.params.id;
    const rowsAffected = await appService.deleteRecipe(RecipeID);
    if (rowsAffected > 0) {
        res.json({ message: 'Recipe deleted' });
    } else {
        res.status(404).json({ error: 'Recipe not found or not deleted' });
    }
});


// /*
// API endpoint to GET all locations
// */
// router.get('/locations', async (req, res) => {
//     const locations = await appService.fetchAllLocations();
//     if (locations.length === 0) {
//         res.status(404).json({ error: 'No locations found' });
//     } else {
//         res.json({ data: locations });
//     }
// });


/*================================================
==================LOCATION ENDPOINTS=================
================================================*/

/*
API endpoint to GET all locations
*/
router.get('/locations', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllLocations(columns);
    res.json({data: tableContent});
});

/*
API endpoint to GET all user locations
*/
router.get('/userlocations', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchUserLocations(columns);
    res.json({data: tableContent});
});

/*================================================
==================GROCERY ENDPOINTS=================
================================================*/
/*
API endpoint to GET all grocery stores
*/
router.get('/grocerystores', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllGroceryStores(columns);
    res.json({data: tableContent});
});

router.get('/nearbystores', async (req, res) => {
    const columns = req.query.columns ? req.query.columns.split(',') : null;
    const tableContent = await appService.fetchAllNearbyStores(columns);
    res.json({data: tableContent});
});



// API endpoint to add an image to a recipe
router.post('/images', async (req, res) => {
    const { recipeID, imageURL, caption } = req.body;

    try {
        // Call the service function to add image to the database
        await appService.addImageToRecipe(recipeID, imageURL, caption);
        res.status(201).json({ message: 'Image added successfully' });
    } catch (error) {
        console.error('Error in /api/images endpoint:', error);
        res.status(500).json({ error: 'Failed to add image' });
    }
});


router.get('/tables', async (req, res) => {
    try {
      const tables = await appService.fetchTableNames();
      res.json({ data: tables });
    } catch (error) {
      console.error('Error fetching table names:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get list of columns for a specific table
router.get('/table-columns', async (req, res) => {
    const tableName = req.query.table;
  
    try {
      const columns = await appService.fetchTableColumns(tableName);
      res.json({ data: columns });
    } catch (error) {
      console.error('Error fetching table columns:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Get data for a specific table with optional column filtering
router.get('/table-data', async (req, res) => {
    const tableName = req.query.table;
    const columns = req.query.columns ? req.query.columns.split(',') : null;
  
    try {
      const data = await appService.fetchTableData(tableName, columns);
      res.json({ data });
    } catch (error) {
      console.error('Error fetching table data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

module.exports = router;


    