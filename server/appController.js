// const express = require('express');
// const appService = require('./appService');

// const router = express.Router();

// // ----------------------------------------------------------
// // API endpoints
// // Modify or extend these routes based on your project's needs.


// /* 
// API test endpoint
// */
// router.get('/test', async (req, res) => {
//     res.send("Hello world!");
// });


// /*
// API endpoint to GET a user's UserID, Name, Points, and Rank
// */
// router.get('/user/:id', async (req, res) => {
//     const UserID = req.params.id;
//     const tableContent = await appService.fetchUser(UserID);
//     res.json({data: tableContent});
// });


// /* 
// API endpoint to GET all users' UserID, Name, Points, and Rank
// */
// router.get('/user', async (req, res) => {
//     const tableContent = await appService.fetchAllUsers();
//     res.json({data: tableContent});
// });

// router.get('/check-db-connection', async (req, res) => {
//     const isConnect = await appService.testOracleConnection();
//     if (isConnect) {
//         res.send('connected');
//     } else {
//         res.send('unable to connect');
//     }
// });


// /*
// API endpoint to GET a user's pantries
// */
// router.get('/pantry/:id', async (req, res) => {
//     const UserID = req.params.id;
//     const tableContent = await appService.fetchPantries(UserID);
//     res.json({data: tableContent});
// });

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


// module.exports = router;


const express = require('express');
const appService = require('./appService');
//const SQL_QUERIES = require('./sqlQueries'); //added after SQL 

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/test', async (req, res) => {
    res.send("Hello world!");
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});



//usertable
router.get('/user', async (req, res) => {
    const tableContent = await appService.fetchUserFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-user", async (req, res) => {
    const initiateResult = await appService.initiateUser();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-user", async (req, res) => {
    const { UserID, Name, Points, Level } = req.body;
    const insertResult = await appService.insertUser(UserID, Name, Points, Level);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-user", async (req, res) => {
    const { UserID, newName } = req.body;
    const updateResult = await appService.updateNameUser(UserID, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//recipetable1
router.get('/recipecreated1', async (req, res) => {
    const tableContent = await appService.fetchRecipeCreated1FromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-recipecreated1", async (req, res) => {
    const initiateResult = await appService.initiateRecipeCreated1();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-recipecreated1", async (req, res) => {
    const { Cuisine, Level } = req.body;
    const insertResult = await appService.insertRecipeCreated1(Cuisine, Level);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-level-recipecreated1", async (req, res) => {
    const { Cuisine, newLevel } = req.body;
    const updateResult = await appService.updateLevelRecipeCreated1(Cuisine, newLevel);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//recipe 2
router.get('/recipecreated2', async (req, res) => {
    const tableContent = await appService.fetchRecipeCreated2FromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-recipecreated2", async (req, res) => {
    const initiateResult = await appService.initiateRecipeCreated2();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-recipecreated2", async (req, res) => {
    const { RecipeID, Cuisine, Time, UserID } = req.body;
    const insertResult = await appService.insertRecipeCreated2(RecipeID, Cuisine, Time, UserID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-time-recipecreated2", async (req, res) => {
    const { RecipeID, newTime } = req.body;
    const updateResult = await appService.updateTimeRecipeCreated2(RecipeID, newTime);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//recipeliked

router.get('/recipesliked', async (req, res) => {
    const tableContent = await appService.fetchRecipesLikedFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-recipesliked", async (req, res) => {
    const initiateResult = await appService.initiateRecipesLiked();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-recipesliked", async (req, res) => {
    const { RecipeID, UserID, Liked } = req.body;
    const insertResult = await appService.insertRecipesLiked(RecipeID, UserID, Liked);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-liked-recipesliked", async (req, res) => {
    const { RecipeID, UserID, newLiked } = req.body;
    const updateResult = await appService.updateLikedRecipesLiked(RecipeID, UserID, newLiked);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//images

router.get('/images', async (req, res) => {
    const tableContent = await appService.fetchImagesFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-images", async (req, res) => {
    const initiateResult = await appService.initiateImages();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-images", async (req, res) => {
    const { URL, Caption } = req.body;
    const insertResult = await appService.insertImages(URL, Caption);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-caption-images", async (req, res) => {
    const { URL, newCaption } = req.body;
    const updateResult = await appService.updateCaptionImages(URL, newCaption);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//imagesinrecipes
router.get('/imagesinrecipes', async (req, res) => {
    const tableContent = await appService.fetchImagesInRecipesFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-imagesinrecipes", async (req, res) => {
    const initiateResult = await appService.initiateImagesInRecipes();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-imagesinrecipes", async (req, res) => {
    const { URL, RecipeID } = req.body;
    const insertResult = await appService.insertImagesInRecipes(URL, RecipeID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-recipeid-imagesinrecipes", async (req, res) => {
    const { URL, newRecipeID } = req.body;
    const updateResult = await appService.updateRecipeIDImagesInRecipes(URL, newRecipeID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



//foodsinrecipe
router.get('/foodsinrecipes', async (req, res) => {
    const tableContent = await appService.fetchFoodsInRecipesFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-foodsinrecipes", async (req, res) => {
    const initiateResult = await appService.initiateFoodsInRecipes();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-foodsinrecipes", async (req, res) => {
    const { Name, RecipeID, Quantity } = req.body;
    const insertResult = await appService.insertFoodsInRecipes(Name, RecipeID, Quantity);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-quantity-foodsinrecipes", async (req, res) => {
    const { Name, RecipeID, newQuantity } = req.body;
    const updateResult = await appService.updateQuantityFoodsInRecipes(Name, RecipeID, newQuantity);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//user1
router.get('/user1', async (req, res) => {
    const tableContent = await appService.fetchUser1FromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-user1", async (req, res) => {
    const initiateResult = await appService.initiateUser1();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-user1", async (req, res) => {
    const { Points, Level } = req.body;
    const insertResult = await appService.insertUser1(Points, Level);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-level-user1", async (req, res) => {
    const { Points, newLevel } = req.body;
    const updateResult = await appService.updateLevelUser1(Points, newLevel);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



//user2
router.get('/user2', async (req, res) => {
    const tableContent = await appService.fetchUser2FromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-user2", async (req, res) => {
    const initiateResult = await appService.initiateUser2();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-user2", async (req, res) => {
    const { UserID, Points } = req.body;
    const insertResult = await appService.insertUser2(UserID, Points);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-points-user2", async (req, res) => {
    const { UserID, newPoints } = req.body;
    const updateResult = await appService.updatePointsUser2(UserID, newPoints);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//location table

router.get('/location', async (req, res) => {
    const tableContent = await appService.fetchLocationFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-location", async (req, res) => {
    const initiateResult = await appService.initiateLocation();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-location", async (req, res) => {
    const { Street, City, Province, Type } = req.body;
    const insertResult = await appService.insertLocation(Street, City, Province, Type);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-type-location", async (req, res) => {
    const { Street, City, Province, newType } = req.body;
    const updateResult = await appService.updateTypeLocation(Street, City, Province, newType);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//userlocation 

router.get('/userlocations', async (req, res) => {
    const tableContent = await appService.fetchUserLocationsFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-userlocations", async (req, res) => {
    const initiateResult = await appService.initiateUserLocations();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-userlocations", async (req, res) => {
    const { UserID, Street, City, Province } = req.body;
    const insertResult = await appService.insertUserLocations(UserID, Street, City, Province);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-street-userlocations", async (req, res) => {
    const { UserID, oldStreet, newStreet } = req.body;
    const updateResult = await appService.updateStreetUserLocations(UserID, oldStreet, newStreet);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//Nearbystore
router.get('/nearbystores', async (req, res) => {
    const tableContent = await appService.fetchNearbyStoresFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-nearbystores", async (req, res) => {
    const initiateResult = await appService.initiateNearbyStores();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-nearbystores", async (req, res) => {
    const { LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance } = req.body;
    const insertResult = await appService.insertNearbyStores(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-distance-nearbystores", async (req, res) => {
    const { LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, newDistance } = req.body;
    const updateResult = await appService.updateDistanceNearbyStores(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, newDistance);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//groecerystore 
router.get('/grocerystore', async (req, res) => {
    const tableContent = await appService.fetchGroceryStoreFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-grocerystore", async (req, res) => {
    const initiateResult = await appService.initiateGroceryStore();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-grocerystore", async (req, res) => {
    const { Street, City, Province, Name } = req.body;
    const insertResult = await appService.insertGroceryStore(Street, City, Province, Name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-grocerystore", async (req, res) => {
    const { Street, City, Province, newName } = req.body;
    const updateResult = await appService.updateNameGroceryStore(Street, City, Province, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//userpantries 
router.get('/userpantries', async (req, res) => {
    const tableContent = await appService.fetchUserPantriesFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-userpantries", async (req, res) => {
    const initiateResult = await appService.initiateUserPantries();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-userpantries", async (req, res) => {
    const { UserID, PantryID } = req.body;
    const insertResult = await appService.insertUserPantries(UserID, PantryID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-pantryid-userpantries", async (req, res) => {
    const { UserID, newPantryID } = req.body;
    const updateResult = await appService.updatePantryIDUserPantries(UserID, newPantryID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//savedpantry 

router.get('/savedpantry', async (req, res) => {
    const tableContent = await appService.fetchSavedPantryFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-savedpantry", async (req, res) => {
    const initiateResult = await appService.initiateSavedPantry();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-savedpantry", async (req, res) => {
    const { PantryID, Category } = req.body;
    const insertResult = await appService.insertSavedPantry(PantryID, Category);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-category-savedpantry", async (req, res) => {
    const { PantryID, newCategory } = req.body;
    const updateResult = await appService.updateCategorySavedPantry(PantryID, newCategory);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//ingredientsinpantry 

router.get('/ingredientsinpantry', async (req, res) => {
    const tableContent = await appService.fetchIngredientsInPantryFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-ingredientsinpantry", async (req, res) => {
    const initiateResult = await appService.initiateIngredientsInPantry();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-ingredientsinpantry", async (req, res) => {
    const { PantryID, DateAdded, Name, Quantity } = req.body;
    const insertResult = await appService.insertIngredientsInPantry(PantryID, DateAdded, Name, Quantity);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-quantity-ingredientsinpantry", async (req, res) => {
    const { PantryID, DateAdded, Name, newQuantity } = req.body;
    const updateResult = await appService.updateQuantityIngredientsInPantry(PantryID, DateAdded, Name, newQuantity);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//fooditem
router.get('/fooditem', async (req, res) => {
    const tableContent = await appService.fetchFoodItemFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-fooditem", async (req, res) => {
    const initiateResult = await appService.initiateFoodItem();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-fooditem", async (req, res) => {
    const { Name, Healthy, ShelfLife, Calories, FoodGroup } = req.body;
    const insertResult = await appService.insertFoodItem(Name, Healthy, ShelfLife, Calories, FoodGroup);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-shelflife-fooditem", async (req, res) => {
    const { Name, newShelfLife } = req.body;
    const updateResult = await appService.updateShelfLifeFoodItem(Name, newShelfLife);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//stepcontains 
router.get('/stepcontains', async (req, res) => {
    const tableContent = await appService.fetchStepContainsFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-stepcontains", async (req, res) => {
    const initiateResult = await appService.initiateStepContains();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-stepcontains", async (req, res) => {
    const { StepNum, Text, RecipeID } = req.body;
    const insertResult = await appService.insertStepContains(StepNum, Text, RecipeID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-text-stepcontains", async (req, res) => {
    const { StepNum, RecipeID, newText } = req.body;
    const updateResult = await appService.updateTextStepContains(StepNum, RecipeID, newText);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//ingredients 
router.get('/ingredientinstances', async (req, res) => {
    const tableContent = await appService.fetchIngredientInstancesFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-ingredientinstances", async (req, res) => {
    const initiateResult = await appService.initiateIngredientInstances();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-ingredientinstances", async (req, res) => {
    const { DateAdded, ExpiryDate, Name } = req.body;
    const insertResult = await appService.insertIngredientInstances(DateAdded, ExpiryDate, Name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-expirydate-ingredientinstances", async (req, res) => {
    const { DateAdded, Name, newExpiryDate } = req.body;
    const updateResult = await appService.updateExpiryDateIngredientInstances(DateAdded, Name, newExpiryDate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;




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



