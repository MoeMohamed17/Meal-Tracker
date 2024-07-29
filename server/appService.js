// const oracledb = require('oracledb');
// const loadEnvFile = require('./utils/envUtil');

// const envVariables = loadEnvFile('./.env');

// // Database configuration setup. Ensure your .env file has the required database credentials.
// const dbConfig = {
//     user: envVariables.ORACLE_USER,
//     password: envVariables.ORACLE_PASS,
//     connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
//     poolMin: 1,
//     poolMax: 3,
//     poolIncrement: 1,
//     poolTimeout: 60
// };

// // initialize connection pool
// async function initializeConnectionPool() {
//     try {
//         await oracledb.createPool(dbConfig);
//         console.log('Connection pool started');
//     } catch (err) {
//         console.error('Initialization error: ' + err.message);
//     }
// }

// async function closePoolAndExit() {
//     console.log('\nTerminating');
//     try {
//         await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
//         console.log('Pool closed');
//         process.exit(0);
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// }

// initializeConnectionPool();

// process
//     .once('SIGTERM', closePoolAndExit)
//     .once('SIGINT', closePoolAndExit);


// // ----------------------------------------------------------
// // Wrapper to manage OracleDB actions, simplifying connection handling.
// async function withOracleDB(action) {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(); // Gets a connection from the default pool 
//         return await action(connection);
//     } catch (err) {
//         console.error(err);
//         throw err;
//     } finally {
//         if (connection) {
//             try {
//                 await connection.close();
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     }
// }


// // ----------------------------------------------------------
// // Core functions for database operations
// // Modify these functions, especially the SQL queries, based on your project's requirements and design.

// /*
// Given a UserID, returns the User's UserID, Name, points, and corresponding rank
// */
// async function fetchUser(UserID) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(`
//             SELECT u.UserId, u.Name, u.Points, p.Rank
//             FROM User2 u
//             JOIN User1 p ON u.Points >= p.Points 
//             WHERE u.UserID=${UserID}
//                 AND p.Points = (
//                     SELECT MAX(Points)
//                     FROM User1
//                     WHERE u.Points >= Points
//             )`);
//         return result.rows;
//     }).catch(() => {    
//         return [];
//     });
// }


// /*
// Returns UserIDs, Names, points, and corresponding ranks for all users
// */
// async function fetchAllUsers(UserID) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(`
//             SELECT u.UserId, u.Name, u.Points, p.Rank
//             FROM User2 u
//             JOIN User1 p ON u.Points >= p.Points 
//             WHERE p.Points = (
//                 SELECT MAX(Points)
//                 FROM User1
//                 WHERE u.Points >= Points
//                 )
//             ORDER BY u.UserID`);
//         return result.rows;
//     }).catch(() => {    
//         return [];
//     });
// }


// /*
// Returns all pantries associated with UserID
// */
// async function fetchPantries(UserID) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(`
//             SELECT u.UserID, u.PantryID, p.Category
//             FROM UserPantries u
//             JOIN SavedPantry p
//             ON u.PantryID = p.PantryID
//             WHERE u.UserID = ${UserID}`);
//         return result.rows;
//     }).catch(() => {    
//         return [];
//     });
// }


// async function testOracleConnection() {
//     return await withOracleDB(async (connection) => {
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

// async function fetchDemotableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM DEMOTABLE');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function updateNameDemotable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }

// module.exports = {
//     fetchUser,
//     fetchAllUsers,
//     fetchPantries,
//     testOracleConnection,
//     fetchDemotableFromDb,
//     initiateDemotable, 
//     insertDemotable, 
//     updateNameDemotable, 
//     countDemotable
// };


const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');
const path = require('path');


const envVariables = loadEnvFile('./.env');


// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};


const sqlFilePath = path.join(__dirname, 'queries.sql');
const SQL_QUERIES = fs.readFileSync(sqlFilePath, 'utf-8').split(';').map(query => query.trim()).filter(query => query);


// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

//helper function
async function executeQuery(query, params = [], autoCommit = true) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, params, { autoCommit });
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

//helper function
async function initiateTable(createTableQuery, tableName) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE ${tableName}`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        //console.log(`CREATE TABLE QUERY1 ${createTableQuery}`) added for bugs 
        await connection.execute(createTableQuery);
        return true;
    }).catch((err) => {
        console.error(err);
        return false;
    });
}

//helper function 
function getQuery(queryIdentifier) {
    return SQL_QUERIES.find(query => query.includes(queryIdentifier));
}


// Users Table Functions
async function fetchUsersFromDb() {
    return await executeQuery(getQuery('SELECT * FROM Users'));
}

async function initiateUsers() {
    return await initiateTable(getQuery('CREATE TABLE Users'), 'Users');
}

async function insertUser(UserID, UserName, Points, UserLevel) {
    return await executeQuery(
        `INSERT INTO Users (UserID, UserName, Points, UserLevel) VALUES (:UserID, :UserName, :Points, :UserLevel)`,
        [UserID, UserName, Points, UserLevel]
    );
}

async function updateNameUser(UserID, newName) {
    return await executeQuery(
        `UPDATE Users SET UserName = :newName WHERE UserID = :UserID`,
        [newName, UserID]
    );
}

// RecipeCreated1 Table Functions
async function fetchRecipeCreated1FromDb() {
    return await executeQuery(getQuery('SELECT * FROM RecipeCreated1'));
}

async function initiateRecipeCreated1() {
    return await initiateTable(getQuery('CREATE TABLE RecipeCreated1'), 'RecipeCreated1');
}

async function insertRecipeCreated1(Cuisine, RecipeLevel) {
    return await executeQuery(
        `INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) VALUES (:Cuisine, :RecipeLevel)`,
        [Cuisine, RecipeLevel]
    );
}

async function updateLevelRecipeCreated1(Cuisine, newLevel) {
    return await executeQuery(
        `UPDATE RecipeCreated1 SET RecipeLevel = :newLevel WHERE Cuisine = :Cuisine`,
        [newLevel, Cuisine]
    );
}

// RecipeCreated2 Table Functions
async function fetchRecipeCreated2FromDb() {
    return await executeQuery(getQuery('SELECT * FROM RecipeCreated2'));
}

async function initiateRecipeCreated2() {
    return await initiateTable(getQuery('CREATE TABLE RecipeCreated2'), 'RecipeCreated2');
}

async function insertRecipeCreated2(RecipeID, Cuisine, CookingTime, UserID) {
    return await executeQuery(
        `INSERT INTO RecipeCreated2 (RecipeID, Cuisine, CookingTime, UserID) VALUES (:RecipeID, :Cuisine, :CookingTime, :UserID)`,
        [RecipeID, Cuisine, CookingTime, UserID]
    );
}

async function updateTimeRecipeCreated2(RecipeID, newTime) {
    return await executeQuery(
        `UPDATE RecipeCreated2 SET CookingTime = :newTime WHERE RecipeID = :RecipeID`,
        [newTime, RecipeID]
    );
}

// RecipesLiked Table Functions
async function fetchRecipesLikedFromDb() {
    return await executeQuery(getQuery('SELECT * FROM RecipesLiked'));
}

async function initiateRecipesLiked() {
    return await initiateTable(getQuery('CREATE TABLE RecipesLiked'), 'RecipesLiked');
}

async function insertRecipesLiked(RecipeID, UserID, Liked) {
    return await executeQuery(
        `INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (:RecipeID, :UserID, :Liked)`,
        [RecipeID, UserID, Liked]
    );
}

async function updateLikedRecipesLiked(RecipeID, UserID, newLiked) {
    return await executeQuery(
        `UPDATE RecipesLiked SET Liked = :newLiked WHERE RecipeID = :RecipeID AND UserID = :UserID`,
        [newLiked, RecipeID, UserID]
    );
}

// Images Table Functions
async function fetchImagesFromDb() {
    return await executeQuery(getQuery('SELECT * FROM Images'));
}

async function initiateImages() {
    return await initiateTable(getQuery('CREATE TABLE Images'), 'Images');
}

async function insertImages(ImageURL, Caption) {
    return await executeQuery(
        `INSERT INTO Images (ImageURL, Caption) VALUES (:ImageURL, :Caption)`,
        [ImageURL, Caption]
    );
}

async function updateCaptionImages(ImageURL, newCaption) {
    return await executeQuery(
        `UPDATE Images SET Caption = :newCaption WHERE ImageURL = :ImageURL`,
        [newCaption, ImageURL]
    );
}

// ImagesInRecipes Table Functions
async function fetchImagesInRecipesFromDb() {
    return await executeQuery(getQuery('SELECT * FROM ImagesInRecipes'));
}

async function initiateImagesInRecipes() {
    return await initiateTable(getQuery('CREATE TABLE ImagesInRecipes'), 'ImagesInRecipes');
}

async function insertImagesInRecipes(ImageURL, RecipeID) {
    return await executeQuery(
        `INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES (:ImageURL, :RecipeID)`,
        [ImageURL, RecipeID]
    );
}

async function updateRecipeIDImagesInRecipes(ImageURL, newRecipeID) {
    return await executeQuery(
        `UPDATE ImagesInRecipes SET RecipeID = :newRecipeID WHERE ImageURL = :ImageURL`,
        [newRecipeID, ImageURL]
    );
}

// FoodsInRecipes Table Functions
async function fetchFoodsInRecipesFromDb() {
    return await executeQuery(getQuery('SELECT * FROM FoodsInRecipes'));
}

async function initiateFoodsInRecipes() {
    return await initiateTable(getQuery('CREATE TABLE FoodsInRecipes'), 'FoodsInRecipes');
}

async function insertFoodsInRecipes(FoodName, RecipeID, Quantity) {
    return await executeQuery(
        `INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES (:FoodName, :RecipeID, :Quantity)`,
        [FoodName, RecipeID, Quantity]
    );
}

async function updateQuantityFoodsInRecipes(FoodName, RecipeID, newQuantity) {
    return await executeQuery(
        `UPDATE FoodsInRecipes SET Quantity = :newQuantity WHERE FoodName = :FoodName AND RecipeID = :RecipeID`,
        [newQuantity, FoodName, RecipeID]
    );
}

// User1 Table Functions
async function fetchUser1FromDb() {
    return await executeQuery(getQuery('SELECT * FROM User1'));
}

async function initiateUser1() {
    return await initiateTable(getQuery('CREATE TABLE User1'), 'User1');
}

async function insertUser1(Points, UserLevel) {
    return await executeQuery(
        `INSERT INTO User1 (Points, UserLevel) VALUES (:Points, :UserLevel)`,
        [Points, UserLevel]
    );
}

async function updateLevelUser1(Points, newLevel) {
    return await executeQuery(
        `UPDATE User1 SET UserLevel = :newLevel WHERE Points = :Points`,
        [newLevel, Points]
    );
}

// User2 Table Functions
async function fetchUser2FromDb() {
    return await executeQuery(getQuery('SELECT * FROM User2'));
}

async function initiateUser2() {
    return await initiateTable(getQuery('CREATE TABLE User2'), 'User2');
}

async function insertUser2(UserID, Points) {
    return await executeQuery(
        `INSERT INTO User2 (UserID, Points) VALUES (:UserID, :Points)`,
        [UserID, Points]
    );
}

async function updatePointsUser2(UserID, newPoints) {
    return await executeQuery(
        `UPDATE User2 SET Points = :newPoints WHERE UserID = :UserID`,
        [newPoints, UserID]
    );
}

// Locations Table Functions
async function fetchLocationFromDb() {
    return await executeQuery(getQuery('SELECT * FROM Locations'));
}

async function initiateLocation() {
    return await initiateTable(getQuery('CREATE TABLE Locations'), 'Locations');
}

async function insertLocation(Street, City, Province, LocationType) {
    return await executeQuery(
        `INSERT INTO Locations (Street, City, Province, LocationType) VALUES (:Street, :City, :Province, :LocationType)`,
        [Street, City, Province, LocationType]
    );
}

async function updateTypeLocation(Street, City, Province, newType) {
    return await executeQuery(
        `UPDATE Locations SET LocationType = :newType WHERE Street = :Street AND City = :City AND Province = :Province`,
        [newType, Street, City, Province]
    );
}

// UserLocations Table Functions
async function fetchUserLocationsFromDb() {
    return await executeQuery(getQuery('SELECT * FROM UserLocations'));
}

async function initiateUserLocations() {
    return await initiateTable(getQuery('CREATE TABLE UserLocations'), 'UserLocations');
}

async function insertUserLocations(UserID, Street, City, Province) {
    return await executeQuery(
        `INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (:UserID, :Street, :City, :Province)`,
        [UserID, Street, City, Province]
    );
}

async function updateStreetUserLocations(UserID, oldStreet, newStreet) {
    return await executeQuery(
        `UPDATE UserLocations SET Street = :newStreet WHERE UserID = :UserID AND Street = :oldStreet`,
        [newStreet, UserID, oldStreet]
    );
}

// NearbyStores Table Functions
async function fetchNearbyStoresFromDb() {
    return await executeQuery(getQuery('SELECT * FROM NearbyStores'));
}

async function initiateNearbyStores() {
    return await initiateTable(getQuery('CREATE TABLE NearbyStores'), 'NearbyStores');
}

async function insertNearbyStores(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) {
    return await executeQuery(
        `INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES (:LocationStreet, :LocationCity, :LocationProvince, :GroceryStoreStreet, :GroceryStoreCity, :GroceryStoreProvince, :Distance)`,
        [LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance]
    );
}

async function updateDistanceNearbyStores(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, newDistance) {
    return await executeQuery(
        `UPDATE NearbyStores SET Distance = :newDistance WHERE LocationStreet = :LocationStreet AND LocationCity = :LocationCity AND LocationProvince = :LocationProvince AND GroceryStoreStreet = :GroceryStoreStreet AND GroceryStoreCity = :GroceryStoreCity AND GroceryStoreProvince = :GroceryStoreProvince`,
        [newDistance, LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince]
    );
}

// GroceryStore Table Functions
async function fetchGroceryStoreFromDb() {
    return await executeQuery(getQuery('SELECT * FROM GroceryStore'));
}

async function initiateGroceryStore() {
    return await initiateTable(getQuery('CREATE TABLE GroceryStore'), 'GroceryStore');
}

async function insertGroceryStore(Street, City, Province, StoreName) {
    return await executeQuery(
        `INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES (:Street, :City, :Province, :StoreName)`,
        [Street, City, Province, StoreName]
    );
}

async function updateNameGroceryStore(Street, City, Province, newName) {
    return await executeQuery(
        `UPDATE GroceryStore SET StoreName = :newName WHERE Street = :Street AND City = :City AND Province = :Province`,
        [newName, Street, City, Province]
    );
}

// UserPantries Table Functions
async function fetchUserPantriesFromDb() {
    return await executeQuery(getQuery('SELECT * FROM UserPantries'));
}

async function initiateUserPantries() {
    return await initiateTable(getQuery('CREATE TABLE UserPantries'), 'UserPantries');
}

async function insertUserPantries(UserID, PantryID) {
    return await executeQuery(
        `INSERT INTO UserPantries (UserID, PantryID) VALUES (:UserID, :PantryID)`,
        [UserID, PantryID]
    );
}

async function updatePantryIDUserPantries(UserID, newPantryID) {
    return await executeQuery(
        `UPDATE UserPantries SET PantryID = :newPantryID WHERE UserID = :UserID`,
        [newPantryID, UserID]
    );
}

// SavedPantry Table Functions
async function fetchSavedPantryFromDb() {
    return await executeQuery(getQuery('SELECT * FROM SavedPantry'));
}

async function initiateSavedPantry() {
    return await initiateTable(getQuery('CREATE TABLE SavedPantry'), 'SavedPantry');
}

async function insertSavedPantry(PantryID, Category) {
    return await executeQuery(
        `INSERT INTO SavedPantry (PantryID, Category) VALUES (:PantryID, :Category)`,
        [PantryID, Category]
    );
}

async function updateCategorySavedPantry(PantryID, newCategory) {
    return await executeQuery(
        `UPDATE SavedPantry SET Category = :newCategory WHERE PantryID = :PantryID`,
        [newCategory, PantryID]
    );
}

// IngredientsInPantry Table Functions
async function fetchIngredientsInPantryFromDb() {
    return await executeQuery(getQuery('SELECT * FROM IngredientsInPantry'));
}

async function initiateIngredientsInPantry() {
    return await initiateTable(getQuery('CREATE TABLE IngredientsInPantry'), 'IngredientsInPantry');
}

async function insertIngredientsInPantry(PantryID, DateAdded, FoodName, Quantity) {
    return await executeQuery(
        `INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (:PantryID, :DateAdded, :FoodName, :Quantity)`,
        [PantryID, DateAdded, FoodName, Quantity]
    );
}

async function updateQuantityIngredientsInPantry(PantryID, DateAdded, FoodName, newQuantity) {
    return await executeQuery(
        `UPDATE IngredientsInPantry SET Quantity = :newQuantity WHERE PantryID = :PantryID AND DateAdded = :DateAdded AND FoodName = :FoodName`,
        [newQuantity, PantryID, DateAdded, FoodName]
    );
}

// FoodItem Table Functions
async function fetchFoodItemFromDb() {
    return await executeQuery(getQuery('SELECT * FROM FoodItem'));
}

async function initiateFoodItem() {
    return await initiateTable(getQuery('CREATE TABLE FoodItem'), 'FoodItem');
}

async function insertFoodItem(FoodName, Healthy, ShelfLife, Calories, FoodGroup) {
    return await executeQuery(
        `INSERT INTO FoodItem (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES (:FoodName, :Healthy, :ShelfLife, :Calories, :FoodGroup)`,
        [FoodName, Healthy, ShelfLife, Calories, FoodGroup]
    );
}

async function updateShelfLifeFoodItem(FoodName, newShelfLife) {
    return await executeQuery(
        `UPDATE FoodItem SET ShelfLife = :newShelfLife WHERE FoodName = :FoodName`,
        [newShelfLife, FoodName]
    );
}

// StepContains Table Functions
async function fetchStepContainsFromDb() {
    return await executeQuery(getQuery('SELECT * FROM StepContains'));
}

async function initiateStepContains() {
    return await initiateTable(getQuery('CREATE TABLE StepContains'), 'StepContains');
}

async function insertStepContains(StepNum, InstructionText, RecipeID) {
    return await executeQuery(
        `INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (:StepNum, :InstructionText, :RecipeID)`,
        [StepNum, InstructionText, RecipeID]
    );
}

async function updateTextStepContains(StepNum, RecipeID, newText) {
    return await executeQuery(
        `UPDATE StepContains SET InstructionText = :newText WHERE StepNum = :StepNum AND RecipeID = :RecipeID`,
        [newText, StepNum, RecipeID]
    );
}

// IngredientInstances Table Functions
async function fetchIngredientInstancesFromDb() {
    return await executeQuery(getQuery('SELECT * FROM IngredientInstances'));
}

async function initiateIngredientInstances() {
    return await initiateTable(getQuery('CREATE TABLE IngredientInstances'), 'IngredientInstances');
}

async function insertIngredientInstances(DateAdded, ExpiryDate, FoodName) {
    return await executeQuery(
        `INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (:DateAdded, :ExpiryDate, :FoodName)`,
        [DateAdded, ExpiryDate, FoodName]
    );
}

async function updateExpiryDateIngredientInstances(DateAdded, FoodName, newExpiryDate) {
    return await executeQuery(
        `UPDATE IngredientInstances SET ExpiryDate = :newExpiryDate WHERE DateAdded = :DateAdded AND FoodName = :FoodName`,
        [newExpiryDate, DateAdded, FoodName]
    );
}

module.exports = {
    testOracleConnection,
    fetchUsersFromDb,
    initiateUsers,
    insertUser,
    updateNameUser,
    fetchRecipeCreated1FromDb,
    initiateRecipeCreated1,
    insertRecipeCreated1,
    updateLevelRecipeCreated1,
    fetchRecipeCreated2FromDb,
    initiateRecipeCreated2,
    insertRecipeCreated2,
    updateTimeRecipeCreated2,
    fetchRecipesLikedFromDb,
    initiateRecipesLiked,
    insertRecipesLiked,
    updateLikedRecipesLiked,
    fetchImagesFromDb,
    initiateImages,
    insertImages,
    updateCaptionImages,
    fetchImagesInRecipesFromDb,
    initiateImagesInRecipes,
    insertImagesInRecipes,
    updateRecipeIDImagesInRecipes,
    fetchFoodsInRecipesFromDb,
    initiateFoodsInRecipes,
    insertFoodsInRecipes,
    updateQuantityFoodsInRecipes,
    fetchUser1FromDb,
    initiateUser1,
    insertUser1,
    updateLevelUser1,
    fetchUser2FromDb,
    initiateUser2,
    insertUser2,
    updatePointsUser2,
    fetchLocationFromDb,
    initiateLocation,
    insertLocation,
    updateTypeLocation,
    fetchUserLocationsFromDb,
    initiateUserLocations,
    insertUserLocations,
    updateStreetUserLocations,
    fetchNearbyStoresFromDb,
    initiateNearbyStores,
    insertNearbyStores,
    updateDistanceNearbyStores,
    fetchGroceryStoreFromDb,
    initiateGroceryStore,
    insertGroceryStore,
    updateNameGroceryStore,
    fetchUserPantriesFromDb,
    initiateUserPantries,
    insertUserPantries,
    updatePantryIDUserPantries,
    fetchSavedPantryFromDb,
    initiateSavedPantry,
    insertSavedPantry,
    updateCategorySavedPantry,
    fetchIngredientsInPantryFromDb,
    initiateIngredientsInPantry,
    insertIngredientsInPantry,
    updateQuantityIngredientsInPantry,
    fetchFoodItemFromDb,
    initiateFoodItem,
    insertFoodItem,
    updateShelfLifeFoodItem,
    fetchStepContainsFromDb,
    initiateStepContains,
    insertStepContains,
    updateTextStepContains,
    fetchIngredientInstancesFromDb,
    initiateIngredientInstances,
    insertIngredientInstances,
    updateExpiryDateIngredientInstances,
};











//After new update 

// async function fetchDemotableFromDb() {
//     return await withOracleDB(async (connection) => {
//         //const result = await connection.execute('SELECT * FROM DEMOTABLE');
//         const result = await connection.execute(SQL_QUERIES.SELECT_ALL_FROM_DEMOTABLE); //after SQL 
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function updateNameDemotable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }



// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }



