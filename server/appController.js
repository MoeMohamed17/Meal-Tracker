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

/*
API endpoint to GET all locations
*/
router.get('/locations', async (req, res) => {
    const locations = await appService.fetchAllLocations();
    if (locations.length === 0) {
        res.status(404).json({ error: 'No locations found' });
    } else {
        res.json({ data: locations });
    }
});

/*
API endpoint to GET all recipes
*/
router.get('/recipes', async (req, res) => {
    const recipes = await appService.fetchAllRecipes();
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
API endpoint to DELETE a recipe
*/
router.delete('/recipe/:id', async (req, res) => {
    const recipeID = req.params.id;
    const rowsAffected = await appService.deleteRecipe(recipeID);
    if (rowsAffected > 0) {
        res.json({ message: 'Recipe deleted' });
    } else {
        res.status(404).json({ error: 'Recipe not found or not deleted' });
    }
});



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



/*
API endpoint to GET a user's UserID, Name, Points, and Rank
*/
router.get('/user/:id', async (req, res) => {
    const UserID = req.params.id;
    const tableContent = await appService.fetchUser(UserID);
    res.json({data: tableContent});
});


/* 
API endpoint to GET all users' UserID, Name, Points, and Rank
*/
router.get('/user', async (req, res) => {
    const tableContent = await appService.fetchAllUsers();
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



// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchDemotableFromDb();
//     res.json({data: tableContent});
// });

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/insert-demotable", async (req, res) => {
//     const { id, name } = req.body;
//     const insertResult = await appService.insertDemotable(id, name);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/update-name-demotable", async (req, res) => {
//     const { oldName, newName } = req.body;
//     const updateResult = await appService.updateNameDemotable(oldName, newName);
//     if (updateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


module.exports = router;


