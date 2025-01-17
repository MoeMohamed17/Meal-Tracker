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

async function fetchRecipes(columns, filter, searchTerm, img, captionless, user) {
    return await withOracleDB(async (connection) => {
        // Sanitize columns
        const allCols = ['r.RecipeID', 'r.RecipeName', 'r.Cuisine', 'r.CookingTime', 'l.RecipeLevel', 'u.UserName', 'u.UserID'];
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
        if (user) {
            filters.push(`u.UserID = ${user}`);
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
                LEFT JOIN Images i ON r.RecipeID = i.RecipeID
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
            SELECT RecipeID
            FROM RecipesLiked 
            WHERE UserID=${UserID}
        `);
        return result.rows.flat();
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Make user like a recipe
async function UserLikedRecipe(info) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            INSERT INTO RecipesLiked (RecipeID, UserID)
            VALUES (:RecipeID, :UserID)`,
        {
            RecipeID: info.RecipeID,
            UserID: info.UserID
        },
        { autoCommit: true}
    );
        return [info.RecipeID, info.UserID];
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Make user unlike a recipe
async function UserUnlikedRecipe(info) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            DELETE FROM RecipesLiked
            WHERE RecipeID = :RecipeID AND UserID = :UserID`,
        {
            RecipeID: info.RecipeID,
            UserID: info.UserID
        },
        { autoCommit: true }
    );
        return [info.RecipeID, info.UserID];
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

// Delete a recipe's steps
async function deleteSteps(recipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            DELETE FROM StepContains
            WHERE RecipeID = :recipeID`,
            [recipeID],
            { autoCommit: true}
        );
        return 1;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

/*================================================
==================IMAGE FUNCTIONS=================
================================================*/
// Fetch all images and captions linked to RecipeID
async function fetchImagesByID(RecipeID, captionless) {
    return await withOracleDB(async (connection) => {
        const cols = captionless == 1 ? 'ImageURL, RecipeID' : 'ImageURL, Caption, RecipeID';
        const result = await connection.execute(`
            SELECT ${cols}
            FROM Images
            WHERE RecipeID = :RecipeID`,
        [RecipeID]);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Insert a single image associated with a recipe
async function insertImage(RecipeID, ImageURL, Caption) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Images (ImageURL, Caption, RecipeID)
            VALUES (:ImageURL, :Caption, :RecipeID)`,
            [
                ImageURL, 
                Caption, 
                RecipeID
            ],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch(() => {
        return false;
    });
}

// Delete a recipe's images and captions
async function deleteImages(recipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            DELETE FROM Images
            WHERE RecipeID = :recipeID`,
            [recipeID],
            { autoCommit: true}
        );
        return 1;
    }).catch((err) => {
        console.error(err);
        return 0;
    })}


async function addImageToRecipe(recipeID, imageURL, caption) {
    return await withOracleDB(async (connection) => {
        // Insert image data into the Images table
        await connection.execute(
            `INSERT INTO Images (ImageURL, Caption, RecipeID) VALUES (:imageURL, :caption, :recipeID)`,
            { imageURL, caption, recipeID },
            { autoCommit: true }
        );
    }).catch((err) => {
        console.error('Error adding image to recipe:', err);
        throw new Error('Failed to add image');
    });
}

// Update an existing recipe
async function updateRecipe(recipe) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            UPDATE RecipeCreated
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
        return [];
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
        const allCols = ['u.UserId', 'u.UserName', 'u.Points', 'l.UserLevel'];
        const selCols = columns ? columns.join(', ') : allCols.join(', ');

        const result = await connection.execute(`
            SELECT ${selCols}
            FROM Users u
            JOIN UserLevels l ON u.Points >= l.Points 
            WHERE u.UserID=${UserID}
            AND l.Points = (
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
        return processResults(result);
    }).catch(() => {    
        return [];
    });
}



// Create a new user
async function createUser(UserName) {
    return await withOracleDB(async (connection) => {
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


// Add 50 points to points associated with UserID
async function updatePoints(UserID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            UPDATE Users
            SET Points = Points+50
            WHERE UserID = :UserID
        `, {
            UserID: UserID
        });
        await connection.commit();
        // console.log(result.rowsAffected);
        return 1;
    }).catch((err) => {
        console.error(err);
        return 0;
    });

}

// Fetch counts of users at each level
async function fetchLevelCounts() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT agg.UserLevel, COUNT(*) AS UserCount
            FROM (
                SELECT u.UserID, (
                    SELECT MAX(l.UserLevel)
                    FROM UserLevels l
                    WHERE u.Points >= l.Points
                ) AS UserLevel
                FROM Users u
            ) agg
            GROUP BY agg.UserLevel
            ORDER BY agg.UserLevel
        `);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

/*================================================
==================PANTRIES FUNCTIONS==================
================================================*/
/*
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

/*
Returns all pantries associated with all users by UserId
*/
async function fetchAllPantries(columns) {
    return await withOracleDB(async (connection) => {
        const allCols = ['up.UserID', 'up.PantryID', 'u.UserName', 'sp.Category'];
        const selCols = columns ? columns.join(', ') : allCols.join(', ');

        const query = `
            SELECT ${selCols}
            FROM UserPantries up
            JOIN Users u ON up.UserID = u.UserID
            JOIN SavedPantry sp ON up.PantryID = sp.PantryID
            ORDER BY up.UserID
        `;

        try {
            const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
            console.log('Query result:', result.rows); // Debug: Log query results
            return result.rows;
        } catch (error) {
            console.error('Error executing query:', error);
            return [];
        }
    }).catch((error) => {
        console.error('Error in withOracleDB:', error);
        return [];
    });
}

// Fetch all ingredient instances for a specific pantry
async function fetchRecipeFoodItems(columns, recipeID) {
    return await withOracleDB(async (connection) => {
        const allCols = ['f.FoodName', 'r.RecipeID', 'f.Quantity'];
        const selCols = columns ? columns.join(', ') : allCols.join(', ');
        console.log(selCols);

        const result = await connection.execute(`
            SELECT ${selCols}
            FROM FoodsInRecipes f, RecipeCreated r
            WHERE f.RecipeID = r.RecipeID
            AND f.RecipeID = :recipeID
        `, [recipeID]);
        return processResults(result);
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


// Function to create a new pantry
async function createPantry(UserID, Category) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO SavedPantry (Category) 
            VALUES (:Category)
            RETURNING PantryID INTO :PantryID`,
            {
                Category,
                PantryID: {
                    type: oracledb.INTEGER,
                    dir: oracledb.BIND_OUT
                }
            },
            { autoCommit: true }
        );

        const pantryID = result.outBinds.PantryID[0];

        await connection.execute(
            `INSERT INTO UserPantries (UserID, PantryID) 
            VALUES (:UserID, :PantryID)`,
            {
                UserID,
                PantryID: pantryID
            },
            { autoCommit: true }
        );

        return { PantryID: pantryID, Category };
    }).catch((err) => {
        console.error(err);
        return false;
    });
}


async function addIngredient(PantryID, FoodName, Quantity, ExpiryDate, ShelfLife, Calories, FoodGroup) {
    return await withOracleDB(async (connection) => {
      try {
        // Check if FoodName exists in FoodItem table
        const foodItemExists = await connection.execute(
          `SELECT COUNT(*) AS COUNT FROM FoodItem WHERE FoodName = :FoodName`,
          { FoodName },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
        if (foodItemExists.rows[0].COUNT === 0) {
          // Insert a new food item if it does not exist
          console.log('Food item does not exist, inserting:', FoodName);
          await connection.execute(
            `INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup) 
            VALUES (:FoodName, :ShelfLife, :Calories, :FoodGroup)`,
            {
              FoodName,
              ShelfLife,
              Calories,
              FoodGroup
            },
            { autoCommit: true }
          );
        }
  
        // Insert the ingredient instance
        const result = await connection.execute(
          `INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity) 
          VALUES (SYSDATE, TO_DATE(:ExpiryDate, 'YYYY-MM-DD'), :FoodName, :PantryID, :Quantity)`,
          {
            ExpiryDate,
            FoodName,
            PantryID,
            Quantity
          },
          { autoCommit: true }
        );
  
        return result.rowsAffected > 0;
      } catch (err) {
        console.error('Database error in addIngredient:', err);
        return false;
      }
    }).catch((err) => {
      console.error('Error in withOracleDB:', err);
      return false;
    });
  }
  



async function fetchCuisineOptions() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT DISTINCT Cuisine FROM RecipeCreated ORDER BY Cuisine
        `);
        return result.rows.map(row => row[0]); // Map the rows to an array of cuisine names
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

// Fetches number of recipes for each cuisine
async function fetchCuisineCounts(threshold) {
    return await withOracleDB(async (connection) => {
        const having = threshold ? `HAVING COUNT(*) >= ${threshold}` : '';
        const query = `
            SELECT Cuisine, COUNT(*) AS Count
            FROM RecipeCreated
            GROUP BY Cuisine
            ${having}
        `;
        const result = await connection.execute(query);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}


/*================================================
==================ADMIN FUNCTIONS==================
================================================*/

async function fetchTableNames() {
    return await withOracleDB(async (connection) => {
      const result = await connection.execute(`
        SELECT table_name
        FROM user_tables
        ORDER BY table_name
      `);
      return result.rows.map(row => row[0]); 
    }).catch((err) => {
      console.error(err);
      return [];
    });
  }

async function fetchTableColumns(tableName) {
    return await withOracleDB(async (connection) => {
      const query = `SELECT column_name FROM user_tab_columns WHERE table_name = '${tableName.toUpperCase()}'`;
      const result = await connection.execute(query);
      return result.rows.map((row) => row[0]);
    }).catch((err) => {
      console.error('Error fetching columns:', err);
      return [];
    });
  }

async function fetchTableData(tableName, columns) {
    return await withOracleDB(async (connection) => {
      const allColsQuery = `SELECT column_name FROM user_tab_columns WHERE table_name = '${tableName.toUpperCase()}'`;
      const allColsResult = await connection.execute(allColsQuery);
      const allCols = allColsResult.rows.map((row) => row[0]);
  
      const selectedCols = columns && columns.length > 0 ? columns : allCols;
      const selColsQuery = selectedCols.join(', ');
  
      const query = `SELECT ${selColsQuery} FROM ${tableName}`;
      const result = await connection.execute(query);
      return result.rows.map((row) => Object.fromEntries(row.map((value, index) => [selectedCols[index], value])));
    }).catch((err) => {
      console.error('Error fetching table data:', err);
      return [];
    });
  }
  
  // Fetch pantry by ID, returning pantry details and the owner
async function fetchPantryById(pantryId) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT PantryID, Category, UserID AS ownerId
            FROM UserPantries
            WHERE PantryID = :pantryId
        `;
        const result = await connection.execute(query, [pantryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }).catch((err) => {
        console.error('Error fetching pantry by ID:', err);
        return null;
    });
}

// Add a pantry to a user's collection
async function addPantryToUser(userId, pantryId) {
    return await withOracleDB(async (connection) => {
        const query = `
            INSERT INTO UserPantries (UserID, PantryID)
            VALUES (:UserID, :PantryID)
        `;
        await connection.execute(query, { UserID: userId, PantryID: pantryId }, { autoCommit: true });
        return true;
    }).catch((err) => {
        console.error('Error adding pantry to user:', err);
        return false;
    });
}

// fetch recipes every user has liked
async function fetchRecipesLikedByAllUsers() {
    return await withOracleDB(async (connection) => {
      const result = await connection.execute(`
        SELECT r.RecipeID, r.RecipeName, r.Cuisine, r.CookingTime, l.RecipeLevel, u.UserName, i.ImageURL, i.Caption
        FROM RecipeCreated r
        JOIN RecipesLiked rl ON r.RecipeID = rl.RecipeID
        LEFT JOIN Users u ON r.UserID = u.UserID
        LEFT JOIN RecipeLevels l ON r.Cuisine = l.Cuisine
        LEFT JOIN Images i ON r.RecipeID = i.RecipeID
        GROUP BY r.RecipeID, r.RecipeName, r.Cuisine, r.CookingTime, l.RecipeLevel, u.UserName, i.ImageURL, i.Caption
        HAVING COUNT(rl.UserID) = (SELECT COUNT(*) FROM Users)
      `);
      return processResults(result);
    }).catch((err) => {
      console.error(err);
      return [];
    });
  }

// Fetch count of recipes liked per user level
async function fetchRecipesLikedPerUserLevel() {
    return await withOracleDB(async (connection) => {
        const query = `
            WITH UserLikes AS (
                SELECT 
                    u.UserID,
                    (SELECT MAX(l.UserLevel)
                     FROM UserLevels l
                     WHERE u.Points >= l.Points) AS UserLevel,
                    COUNT(rl.RecipeID) AS RecipesLiked
                FROM 
                    Users u
                LEFT JOIN 
                    RecipesLiked rl ON u.UserID = rl.UserID
                GROUP BY 
                    u.UserID, u.Points
            )
            SELECT 
                UserLevel,
                COUNT(UserID) AS NumberOfUsers,
                AVG(RecipesLiked) AS AverageRecipesLiked
            FROM 
                UserLikes
            GROUP BY 
                UserLevel
            ORDER BY 
                UserLevel
        `;
        
        const result = await connection.execute(query);
        return processResults(result);
    }).catch((err) => {
        console.error(err);
        return [];
    });
}

async function fetchFoodItems() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT FoodName, ShelfLife, Calories, FoodGroup
            FROM FoodItem
            ORDER BY FoodName
        `);
        return processResults(result);
    }).catch((err) => {
        console.error('Error fetching food items:', err);
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
    fetchLikedRecipes,
    fetchUserLikedRecipes,
    insertStep,
    fetchImagesByID,
    fetchRecipeSteps,
    createUser,
    fetchIngredientInstances,
    UserLikedRecipe,
    UserUnlikedRecipe,
    addImageToRecipe,
    createPantry,
    addIngredient,
    fetchCuisineOptions,
    fetchRecipeFoodItems,
    fetchAllPantries,
    deleteSteps,
    deleteImages,
    insertImage,
    fetchTableNames,
    fetchTableData,
    fetchTableColumns,
    updatePoints,
    fetchPantryById,
    addPantryToUser,
    fetchLevelCounts,
    fetchCuisineCounts,
    fetchRecipesLikedByAllUsers,
    fetchRecipesLikedPerUserLevel,
    fetchFoodItems
};
