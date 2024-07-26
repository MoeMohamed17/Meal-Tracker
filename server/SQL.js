// sqlQueries.js

const SQL_QUERIES = {
    CREATE_RECIPE_CREATED1: `
        CREATE TABLE RecipeCreated1(
            Cuisine CHAR(30),
            Level INTEGER,
            PRIMARY KEY (Cuisine)
                ON DELETE NO ACTION
                ON UPDATE CASCADE
        )
    `,
    CREATE_RECIPE_CREATED2: `
        CREATE TABLE RecipeCreated2(
            RecipeID INTEGER,
            Cuisine CHAR(30),
            Time TIME,
            UserID INTEGER NOT NULL,
            PRIMARY KEY (RecipeID),
            FOREIGN KEY (UserID) REFERENCES
                User
                ON DELETE NO ACTION
                ON UPDATE CASCADE
        )
    `,
    CREATE_RECIPES_LIKED: `
        CREATE TABLE RecipesLiked(
            RecipeID INTEGER,
            UserID INTEGER,
            Liked TINYINT,
            PRIMARY KEY (RecipeID, UserID),
            FOREIGN KEY (RecipeID) REFERENCES
                RecipeCreated2,
            FOREIGN KEY (UserID) REFERENCES
                User
        )
    `,
    CREATE_IMAGES: `
        CREATE TABLE Images(
            URL VARCHAR(512),
            Caption VARCHAR(512),
            PRIMARY KEY (URL)
        )
    `,
    CREATE_IMAGES_IN_RECIPES: `
        CREATE TABLE ImagesInRecipes(
            URL VARCHAR(512),
            RecipeID INTEGER,
            PRIMARY KEY (URL, RecipeID),
            FOREIGN KEY (URL) REFERENCES
                Images,
            FOREIGN KEY (RecipeID) REFERENCES
                RecipeCreated2
        )
    `,
    CREATE_FOODS_IN_RECIPES: `
        CREATE TABLE FoodsInRecipes(
            Name VARCHAR(30),
            RecipeID INTEGER,
            Quantity INTEGER NOT NULL,
            PRIMARY KEY (Name, RecipeID),
            FOREIGN KEY (Name) REFERENCES
                FoodItem,
            FOREIGN KEY (RecipeID) REFERENCES
                RecipeCreated2
        )
    `,
    CREATE_USER1: `
        CREATE TABLE User1(
            Points INTEGER,
            Level INTEGER,
            PRIMARY KEY (Points)
        )
    `,
    CREATE_USER2: `
        CREATE TABLE User2(
            UserID INTEGER,
            Points INTEGER,
            PRIMARY KEY (UserID)
        )
    `,
    CREATE_USER_LOCATIONS: `
        CREATE TABLE UserLocations(
            UserID INTEGER,
            Street VARCHAR(30),
            City VARCHAR(30),
            Province VARCHAR(30),	
            PRIMARY KEY(UserID, Street, City, Province),
            FOREIGN KEY (UserID) REFERENCES
                User,
            FOREIGN KEY (Street) REFERENCES
                Location,
            FOREIGN KEY (City) REFERENCES
                Location,
            FOREIGN KEY (Province) REFERENCES
                Location
        )
    `,
    CREATE_LOCATION: `
        CREATE TABLE Location(
            Street VARCHAR(30),
            City VARCHAR(30),
            Province VARCHAR(30),
            Type VARCHAR(30),
            PRIMARY KEY (Street, City, Province)
        )
    `,
    CREATE_NEARBY_STORES: `
        CREATE TABLE NearbyStores(
            LocationStreet VARCHAR(30),
            LocationCity VARCHAR(30),
            LocationProvince VARCHAR(30),
            GroceryStoreStreet VARCHAR(30),
            GroceryStoreCity VARCHAR(30),
            GroceryStoreProvince VARCHAR(30),
            Distance INTEGER NOT NULL,
            PRIMARY KEY(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince),
            FOREIGN KEY (LocationStreet) REFERENCES Location,
            FOREIGN KEY (LocationCity) REFERENCES Location,
            FOREIGN KEY (LocationProvince) REFERENCES Location,
            FOREIGN KEY (GroceryStoreStreet) REFERENCES GroceryStore,
            FOREIGN KEY (GroceryStoreCity) REFERENCES GroceryStore,
            FOREIGN KEY (GroceryStoreProvince) REFERENCES GroceryStore
        )
    `,
    CREATE_GROCERY_STORE: `
        CREATE TABLE GroceryStore(
            Street VARCHAR(30),
            City VARCHAR(30),
            Province VARCHAR(30),
            Name VARCHAR(30) NOT NULL,
            PRIMARY KEY (Street, City, Province)
        )
    `,
    CREATE_USER_PANTRIES: `
        CREATE TABLE UserPantries(
            UserID INTEGER,
            PantryID INTEGER,
            PRIMARY KEY (UserID, PantryID),
            FOREIGN KEY (UserID) REFERENCES User,
            FOREIGN KEY (PantryID) REFERENCES SavedPantry
        )
    `,
    CREATE_SAVED_PANTRY: `
        CREATE TABLE SavedPantry(
            PantryID INTEGER,
            Category CHAR(30),
            PRIMARY KEY (PantryID)
        )
    `,
    CREATE_INGREDIENTS_IN_PANTRY: `
        CREATE TABLE IngredientsInPantry(
            PantryID INTEGER,
            DateAdded DATE,
            Name VARCHAR(30),
            Quantity INTEGER NOT NULL,
            PRIMARY KEY (PantryID, DateAdded, Name),
            FOREIGN KEY (PantryID) REFERENCES SavedPantry,
            FOREIGN KEY (DateAdded, Name) REFERENCES IngredientInstances
        )
    `,
    CREATE_FOOD_ITEM1: `
        CREATE TABLE FoodItem1(
            Calories INTEGER,
            FoodGroup VARCHAR(30),
            Healthy TINYINT,
            PRIMARY KEY (Calories, FoodGroup)
        )
    `,
    CREATE_FOOD_ITEM2: `
        CREATE TABLE FoodItem2(
            Calories INTEGER,
            FoodGroup VARCHAR(30),
            Name VARCHAR(30),
            ShelfLife TIME,
            PRIMARY KEY (Name)
        )
    `,
    CREATE_STEP_CONTAINS: `
        CREATE TABLE StepContains(
            StepNum INTEGER,
            TEXT VARCHAR(512) NOT NULL,
            RecipeID INTEGER,
            PRIMARY KEY (StepNum, RecipeID),
            FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2
                ON DELETE CASCADE
        )
    `,
    CREATE_INGREDIENT_INSTANCES: `
        CREATE TABLE IngredientInstances(
            DateAdded DATE,
            ExpiryDate DATE,
            Name CHAR(30),
            PRIMARY KEY (DateAdded, Name),
            FOREIGN KEY (Name) REFERENCES FoodItem
                ON DELETE CASCADE
        )
    `,
    INSERT_RECIPE_CREATED: `
        INSERT INTO RecipeCreated VALUES 
        (1, 'Italian', '01:30', 1, 1),
        (2, 'Japanese', '01:15', 2, 2),
        (10, 'Greek', '01:30', 6, 3),
        (28, 'Italian', '00:45', 5, 4),
        (15, 'Italian', '01:00', 3, 5)
    `,
    INSERT_RECIPES_LIKED: `
        INSERT INTO RecipesLiked VALUES 
        (1, 3, 3),
        (19, 5, 30),
        (1, 3, 36),
        (3, 6, 25),
        (8, 5, 43)
    `,
    INSERT_IMAGES: `
        INSERT INTO Images VALUES 
        ('https://xyz.com', 'lasagna'),
        ('https://xyz1.com', 'sushi'),
        ('https://xyz2.com', 'pizza'),
        ('https://xyz3.com', 'ramen'),
        ('https://xyz4.com', 'chicken parmesan')
    `,
    INSERT_IMAGES_IN_RECIPES: `
        INSERT INTO ImagesInRecipes VALUES 
        ('https://xyz4.com', 88),
        ('https://xyz3.com', 56),
        ('https://xyz8.com', 34),
        ('https://xyz9.com', 10),
        ('https://xyz4.com', 24)
    `,
    INSERT_FOODS_IN_RECIPES: `
        INSERT INTO FoodsInRecipes VALUES 
        ('tomato', 1, 2),
        ('onion', 45, 1),
        ('garlic', 3, 5),
        ('bell pepper', 5, 2),
        ('broccoli', 4, 1)
    `,
    INSERT_USER: `
        INSERT INTO User VALUES 
        (1, 'Karen', 300, 6),
        (2, 'Moe', 87, 9),
        (3, 'Chris', 303, 8),
        (300, 'Bob', 65, 4),
        (499, 'Joe', 0, 1)
    `,
    INSERT_USER_LOCATIONS: `
        INSERT INTO UserLocations VALUES 
        (1, '3 University Drive', 'Vancouver', 'British Columbia'),
        (34, '88 Broadway Street', 'Vancouver', 'British Columbia'),
        (67, '77 Fieldstone Way', 'Toronto', 'Ontario'),
        (34, '90 Orange Road', 'Edmonton', 'Alberta'),
        (99, '8 Blue Willow Drive', 'Vaughan', 'Ontario')
    `,
    INSERT_LOCATION: `
        INSERT INTO Location VALUES 
        ('8 Blue Willow Drive', 'Vaughan', 'Ontario', 'home'),
        ('90 Yellow Road', 'Vaughan', 'Ontario', 'work'),
        ('8 Orange Way', 'Toronto', 'Ontario', 'home'),
        ('192 Willow Drive', 'Vancouver', 'British Columbia', 'home'),
        ('80 Blue Drive', 'Vaughan', 'Ontario', 'work')
    `,
    INSERT_NEARBY_STORES: `
        INSERT INTO NearbyStores VALUES 
        ('80 Blue Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Vaughan', 'Ontario', 2.3),
        ('3 Yellow Road', 'Toronto', 'Ontario', '10 Blue Drive', 'Vaughan', 'Ontario', 4.3),
        ('230 Brown Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Mississauga', 'Ontario', 8.0),
        ('90 Salish Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Markham', 'Ontario', 2.6),
        ('80 Pear Drive', 'Vaughan', 'Ontario', '90 Apple Drive', 'Calgary', 'Alberta', 1.9)
    `,
    INSERT_GROCERY_STORE: `
        INSERT INTO GroceryStore VALUES 
        ('80 Pear Drive', 'Vaughan', 'Ontario', 'Sue’s Mart'),
        ('45 Apple Drive', 'Toronto', 'Ontario', 'Loblaw'),
        ('50 Yellow Way', 'Vaughan', 'Ontario', 'FreshCo'),
        ('77 Marker Drive', 'Vancouver', 'British Columbia', 'Walmart'),
        ('33 Mouse Lane', 'Edmonton', 'Alberta', 'Farm Boy')
    `,
    INSERT_USER_PANTRIES: `
        INSERT INTO UserPantries VALUES 
        (1, 2),
        (4, 27),
        (8, 28),
        (5, 20),
        (10, 8)
    `,
    INSERT_SAVED_PANTRY: `
        INSERT INTO SavedPantry VALUES 
        (2, 'work'),
        (4, 'home'),
        (6, 'beach house'),
        (5, 'airbnb'),
        (8, 'airbnb')
    `,
    INSERT_INGREDIENTS_IN_PANTRY: `
        INSERT INTO IngredientsInPantry VALUES 
        (3, TO_DATE('2024-07-06', 'YYYY-MM-DD'), 'Broccoli', 1),
        (10, TO_DATE('2024-08-06', 'YYYY-MM-DD'), 'Bread', 4),
        (32, TO_DATE('2024-09-03', 'YYYY-MM-DD'), 'Orange', 6),
        (4, TO_DATE('2024-09-04', 'YYYY-MM-DD'), 'Milk', 3),
        (6, TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Lemon', 4)
    `,
    INSERT_FOOD_ITEM: `
        INSERT INTO FoodItem VALUES 
        ('broccoli', 0, INTERVAL '36' HOUR, 200, 'vegetable'),
        ('milk', 0, INTERVAL '48' HOUR, 250, 'dairy'),
        ('orange', 0, INTERVAL '98' HOUR, 20, 'fruit'),
        ('pasta', 1, INTERVAL '100' HOUR, 300, 'grains'),
        ('bread', 1, INTERVAL '200' HOUR, 450, 'grains')
    `,
    INSERT_STEP_CONTAINS: `
        INSERT INTO StepContains VALUES 
        (3, 'Preheat oven to 350 deg F'),
        (1, 'Chop the onion into cubes'),
        (4, 'Place a pan on high heat'),
        (2, 'Mince 3 garlic cloves'),
        (8, 'Let the dish cook for 30 minutes')
    `,
    INSERT_INGREDIENT_INSTANCES: `
        INSERT INTO IngredientInstances VALUES 
        (TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-07-29', 'YYYY-MM-DD'), 'broccoli'),
        (TO_DATE('2024-05-20', 'YYYY-MM-DD'), TO_DATE('2024-06-01', 'YYYY-MM-DD'), 'milk'),
        (TO_DATE('2024-06-01', 'YYYY-MM-DD'), TO_DATE('2024-06-02', 'YYYY-MM-DD'), 'lemon'),
        (TO_DATE('2024-04-24', 'YYYY-MM-DD'), TO_DATE('2024-05-24', 'YYYY-MM-DD'), 'lime'),
        (TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-08-30', 'YYYY-MM-DD'), 'bell pepper')
    `
};

module.exports = SQL_QUERIES;
