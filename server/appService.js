const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

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

// Helper function for turning list of lists into list of dictionaries
function processResults(result) {
    const colNames = result.metaData.map(column => column.name);
    const rows = result.rows.map(row => {
        const rowDict = {};
        row.forEach((value, index) => {
            rowDict[colNames[index]] = value;
        });
        return rowDict;
    });

    return rows;
}



/*================================================
=================RECIPE FUNCTIONS=================
================================================*/

async function fetchRecipes(columns, filter, searchTerm, img, captionless) {
    return await withOracleDB(async (connection) => {
        // Sanitize columns
        const allCols = ['r.RecipeID', 'r.RecipeName', 'r.Cuisine', 'r.CookingTime', 'l.RecipeLevel', 'u.UserName'];
        const pKey = 'r.RecipeID';
        let selCols = columns ? columns : allCols;
        if (!selCols.includes(pKey)) {
            selCols = [pKey, ...selCols];
        }
        const cols = selCols.join(', ');

        // Sanitize the filter input
        const filters = [];
        if (filter) {
            filters.push(`r.Cuisine = '${filter}'`);
        }
        if (searchTerm) {
            if (!isNaN(searchTerm)) {
                // If searchTerm is numeric, assume it's an ID
                filters.push(`r.RecipeID = ${searchTerm}`);
            } else {
                // Otherwise, search by RecipeName
                filters.push(`LOWER(r.RecipeName) LIKE LOWER('%${searchTerm}%')`);
            }
        }
        const filtString = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        if (!img) {
            // Query without images
            const query = `
                SELECT ${cols}
                FROM RecipeCreated r
                LEFT JOIN Users u ON r.UserID = u.UserID
                LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
                ${filtString}
                ORDER BY r.RecipeID`;

            // Execute the query
            const result = await connection.execute(query);
            const processedResults = processResults(result);
            return processedResults;

        } else {
            // With images
            const imgCols = captionless == 1 ? 'i.ImageURL' : 'i.ImageURL, i.Caption';
            const query = `
                SELECT ${cols}, ${imgCols}
                FROM RecipeCreated r
                LEFT JOIN Users u ON r.UserID = u.UserID
                LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
                LEFT JOIN ImagesInRecipes ir ON r.RecipeID = ir.RecipeID
                LEFT JOIN Images i ON ir.ImageURL = i.ImageURL
                ${filtString}
                ORDER BY r.RecipeID`;

            // Execute the query
            const result = await connection.execute(query);
            const processedResults = processResults(result);
            return processedResults;
        }
    }).catch((err) => {
        console.error(err);
        return [];
    });
}




// Fetches recipe by RecipeID
async function fetchRecipeByID(RecipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT r.RecipeID, r.RecipeName, r.Cuisine, r.CookingTime, l.RecipeLevel, u.UserName
            FROM RecipeCreated r
            LEFT JOIN Users u ON r.UserID = u.UserID
            LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
            WHERE r.RecipeID = :RecipeID`,
        [RecipeID]
    );
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Fetch all liked recipes
async function fetchLikedRecipes() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT r.RecipeID, r.RecipeName, r.Cuisine, r.CookingTime, l.RecipeLevel, u.UserName
            FROM RecipeCreated r
            JOIN RecipesLiked rl ON r.RecipeID = rl.RecipeID
            LEFT JOIN Users u ON r.UserID = u.UserID
            LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
            ORDER BY r.RecipeID
        `);
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Fetch user's liked recipes
async function fetchUserLikedRecipes(UserID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT r.RecipeID, r.RecipeName, r.Cuisine, r.CookingTime, l.RecipeLevel, u.UserName
            FROM RecipeCreated r
            JOIN RecipesLiked rl ON r.RecipeID = rl.RecipeID
            LEFT JOIN Users u ON r.UserID = u.UserID
            LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
            WHERE r.UserID=${UserID}
        `);
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Create a new recipe
async function createRecipe(recipe) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID) 
            VALUES (:RecipeName, :Cuisine, :CookingTime, :UserID)
            RETURNING RecipeID INTO :RecipeID`,
            {
                RecipeName: recipe.RecipeName, 
                Cuisine: recipe.Cuisine, 
                CookingTime: recipe.CookingTime, 
                UserID: recipe.UserID,
                RecipeID: { 
                    type: oracledb.INTEGER,
                    dir: oracledb.BIND_OUT
                }
            },
            { autoCommit: true }
        );
        return {
            RecipeID: result.outBinds.RecipeID[0],
            RecipeName: recipe.RecipeName,
            Cuisine: recipe.Cuisine,
            CookingTime: recipe.CookingTime,
            UserID: recipe.UserID
        };
    }).catch(() => {
        return false;
    });
}

// Delete a recipe
async function deleteRecipe(recipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            DELETE FROM RecipeCreated
            WHERE RecipeID = :recipeID`,
            [recipeID],
            { autoCommit: true}
        );
        return result.rowsAffected;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

// Fetch steps for a specific recipe by RecipeID
async function fetchRecipeSteps(RecipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT StepNum, InstructionText
            FROM StepContains
            WHERE RecipeID = :RecipeID
            ORDER BY StepNum
        `, [RecipeID]);
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

/*================================================
==================IMAGE FUNCTIONS=================
================================================*/
// Fetch all images and captions linked to RecipeID
async function fetchImagesByID(RecipeID, captionless) {
    return await withOracleDB(async (connection) => {
        const cols = captionless == 1 ? 'i.ImageURL' : 'i.ImageURL, i.Caption';
        const result = await connection.execute(`
            SELECT ${cols}
            FROM ImagesInRecipes ir
            JOIN Images i ON ir.ImageURL = i.ImageURL
            WHERE ir.RecipeID = :RecipeID`,
        [RecipeID]);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}




// Insert a single step associated with a recipe
async function insertStep(StepNum, InstructionText, RecipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
            VALUES (:StepNum, :InstructionText, :RecipeID)`,
            [
                StepNum, 
                InstructionText, 
                RecipeID
            ],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch(() => {
        return false;
    });
}

/*================================================
==================USER FUNCTIONS==================
================================================*/
/*
Given a UserID, returns the User's UserID, Name, points, and corresponding rank
*/
async function fetchUser(UserID, columns) {
    return await withOracleDB(async (connection) => {
        const allCols = ['u.UserId', 'u.UserName', 'u.Points', 'p.UserLevel'];
        const selCols = columns ? columns.join(', ') : allCols.join(', ');

        const result = await connection.execute(`
            SELECT ${selCols}
            FROM Users u
            JOIN UserLevels p ON u.Points >= p.Points 
            WHERE u.UserID=${UserID}
            AND p.Points = (
                SELECT MAX(Points)
                FROM UserLevels
                WHERE u.Points >= Points
            )`);
        return result.rows;
    }).catch(() => {    
        return [];
    });
}

/*
Returns UserIDs, Names, points, and corresponding ranks for all users
*/
async function fetchAllUsers(columns) {
    return await withOracleDB(async (connection) => {
        const allCols = ['u.UserId', 'u.UserName', 'u.Points', 'p.UserLevel'];
        const selCols = columns ? columns.join(', ') : allCols.join(', ');

        const result = await connection.execute(`
            SELECT ${selCols}
            FROM Users u
            JOIN UserLevels p ON u.Points >= p.Points 
            AND p.Points = (
                SELECT MAX(Points)
                FROM UserLevels
                WHERE u.Points >= Points)
            ORDER BY u.UserId
            `);
        return result.rows;
    }).catch(() => {    
        return [];
    });
}

// Create a new user
async function createUser(UserName) {
    return await withOracleDB(async (connection) => {
        console.log(UserName);
        const result = await connection.execute(
            `INSERT INTO Users (UserName) 
            VALUES (:UserName)
            RETURNING UserID INTO :UserID`,
            {
                UserName: UserName,
                UserID: { 
                    type: oracledb.INTEGER,
                    dir: oracledb.BIND_OUT
                }
            },
            { autoCommit: true }
        );
        return {
            UserID: result.outBinds.UserID[0],
            UserName: UserName,
            Points: 0
        };
    }).catch(() => {
        return false;
    });
}


/*
Returns all pantries associated with UserID
*/
async function fetchPantries(UserID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT u.UserID, u.PantryID, p.Category
            FROM UserPantries u
            JOIN SavedPantry p
            ON u.PantryID = p.PantryID
            WHERE u.UserID = ${UserID}`);
        return processResults(result);
    }).catch(() => {    
        return [];
    });
}







// Update an existing recipe
async function updateRecipe(recipe) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            UPDATE RecipeCreated2
            SET RecipeName = :recipeName,
                Cuisine = :cuisine,
                CookingTime = :cookingTime,
                UserID = :userID
            WHERE RecipeID = :recipeID
        `, {
            recipeName: recipe.RecipeName,
            cuisine: recipe.Cuisine,
            cookingTime: recipe.CookingTime,
            userID: recipe.UserID,
            recipeID: recipe.RecipeID
        });
        await connection.commit();
        return result.rowsAffected;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

// Fetch all locations
async function fetchAllLocations() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT Street, City, Province, LocationType
            FROM Locations
            ORDER BY City, Street
        `);
        return result.rows;
    }).catch((err) => {
        console.error(err);
        return [];
    });
}



// Fetch all ingredient instances for a specific pantry
async function fetchIngredientInstances(pantryID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT DateAdded, ExpiryDate, FoodName, Quantity
            FROM IngredientInstances
            WHERE PantryID = :pantryID
            ORDER BY DateAdded
        `, [pantryID]);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}


module.exports = {
    fetchUser,
    fetchAllUsers,
    fetchPantries,
    testOracleConnection,
    fetchRecipes,
    fetchRecipeByID,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    fetchAllLocations,
    fetchLikedRecipes,
    fetchUserLikedRecipes,
    insertStep,
    fetchImagesByID,
    fetchRecipeSteps,
    createUser,
    fetchIngredientInstances
};

