DROP TABLE RecipesLiked;
DROP TABLE ImagesInRecipes;
DROP TABLE FoodsInRecipes;
DROP TABLE IngredientInstances;
DROP TABLE IngredientsInPantry;
DROP TABLE UserLocations;
DROP TABLE UserPantries;
DROP TABLE StepContains;
DROP TABLE RecipeCreated2;
DROP TABLE GroceryStore;
DROP TABLE NearbyStores;
DROP TABLE SavedPantry;
DROP TABLE Locations;
DROP TABLE Users2;
DROP TABLE FoodItem1;
DROP TABLE FoodItem2;
DROP TABLE Images;
DROP TABLE RecipeCreated1;
-- DROP TABLE Users1;



-- CREATE TABLE Users1(
--     UserID INTEGER,
--     UserLevel INTEGER,
--     Points INTEGER,
--     PRIMARY KEY (UserID)
-- );

-- Create Users table
CREATE TABLE Users2(
    UserID INTEGER,
    UserName VARCHAR2(50),
    Points INTEGER,
    UserLevel INTEGER,
    PRIMARY KEY (UserID)
);

-- Create RecipeCreated1 table
CREATE TABLE RecipeCreated1(
    Cuisine VARCHAR(30),
    RecipeLevel INTEGER,
    PRIMARY KEY (Cuisine)
);

-- Create RecipeCreated2 table
CREATE TABLE RecipeCreated2(
    RecipeID INTEGER,
    RecipeName VARCHAR(50),
    Cuisine CHAR(30),
    CookingTime INTERVAL DAY TO SECOND,
    UserID INTEGER NOT NULL,
    PRIMARY KEY (RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users2(UserID)
);

-- Create RecipesLiked table
CREATE TABLE RecipesLiked(
    RecipeID INTEGER,
    UserID INTEGER,
    Liked INTEGER,
    PRIMARY KEY (RecipeID, UserID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users2(UserID)
);

-- Create Images table
CREATE TABLE Images(
    ImageURL VARCHAR2(512),
    Caption VARCHAR2(512),
    PRIMARY KEY (ImageURL)
);

-- Create ImagesInRecipes table
CREATE TABLE ImagesInRecipes(
    ImageURL VARCHAR2(512),
    RecipeID INTEGER,
    PRIMARY KEY (ImageURL, RecipeID),
    FOREIGN KEY (ImageURL) REFERENCES Images(ImageURL),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
);

-- Create Locations table
CREATE TABLE Locations(
    Street VARCHAR2(30),
    City VARCHAR2(30),
    Province VARCHAR2(30),
    LocationType VARCHAR2(30),
    PRIMARY KEY (Street, City, Province)
);

-- Create UserLocations table
CREATE TABLE UserLocations(
    UserID INTEGER,
    Street VARCHAR2(30),
    City VARCHAR2(30),
    Province VARCHAR2(30),    
    PRIMARY KEY(UserID, Street, City, Province),
    FOREIGN KEY (UserID) REFERENCES Users2(UserID),
    FOREIGN KEY (Street, City, Province) REFERENCES Locations(Street, City, Province)
);

-- Create GroceryStore table
CREATE TABLE GroceryStore(
    Street VARCHAR2(30),
    City VARCHAR2(30),
    Province VARCHAR2(30),
    StoreName VARCHAR2(30) NOT NULL,
    PRIMARY KEY (Street, City, Province)
);

-- Create NearbyStores table
CREATE TABLE NearbyStores(
    LocationStreet VARCHAR2(30),
    LocationCity VARCHAR2(30),
    LocationProvince VARCHAR2(30),
    GroceryStoreStreet VARCHAR2(30),
    GroceryStoreCity VARCHAR2(30),
    GroceryStoreProvince VARCHAR2(30),
    Distance INTEGER NOT NULL,
    PRIMARY KEY(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince),
    FOREIGN KEY (LocationStreet, LocationCity, LocationProvince) REFERENCES Locations(Street, City, Province),
    FOREIGN KEY (GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince) REFERENCES GroceryStore(Street, City, Province)
);

-- Create SavedPantry table
CREATE TABLE SavedPantry(
    PantryID INTEGER,
    Category CHAR(30),
    PRIMARY KEY (PantryID)
);

-- Create UserPantries table
CREATE TABLE UserPantries(
    UserID INTEGER,
    PantryID INTEGER,
    PRIMARY KEY (UserID, PantryID),
    FOREIGN KEY (UserID) REFERENCES Users2(UserID),
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID)
);

-- Create FoodItem1 table
CREATE TABLE FoodItem1(
    Healthy INTEGER,
    Calories INTEGER,
    FoodGroup VARCHAR2(30),
    PRIMARY KEY (Calories,FoodGroup)
);

-- Create FoodItem2 table
CREATE TABLE FoodItem2(
    FoodName VARCHAR2(30),
    ShelfLife INTERVAL DAY TO SECOND,
    Calories INTEGER,
    FoodGroup VARCHAR2(30),
    PRIMARY KEY (FoodName)
);

-- Create FoodsInRecipes table
CREATE TABLE FoodsInRecipes(
    FoodName VARCHAR2(30),
    RecipeID INTEGER,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (FoodName, RecipeID),
    FOREIGN KEY (FoodName) REFERENCES FoodItem2(FoodName),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
);

-- Create StepContains table
CREATE TABLE StepContains(
    StepNum INTEGER,
    InstructionText VARCHAR2(512),
    RecipeID INTEGER,
    PRIMARY KEY (StepNum, RecipeID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
        ON DELETE CASCADE
);

-- Create IngredientInstances table
CREATE TABLE IngredientInstances(
    DateAdded DATE,
    ExpiryDate DATE,
    FoodName CHAR(30),
    PRIMARY KEY (DateAdded, FoodName),
    FOREIGN KEY (FoodName) REFERENCES FoodItem2(FoodName)
        ON DELETE CASCADE
);

-- Create IngredientsInPantry table
CREATE TABLE IngredientsInPantry(
    PantryID INTEGER,
    DateAdded DATE,
    FoodName VARCHAR2(30),
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (PantryID, DateAdded, FoodName),
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID),
    FOREIGN KEY (DateAdded, FoodName) REFERENCES IngredientInstances(DateAdded, FoodName)
);


-- Insert statements
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) VALUES (1, 'Karen', 300, 6);
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) VALUES (2, 'Moe', 87, 9);
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) VALUES (3, 'Chris', 303, 8);
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) VALUES (300, 'Bob', 65, 4);
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) VALUES (499, 'Joe', 0, 1);

INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID) VALUES (1, 'Lasagna', 'Italian', INTERVAL '1' HOUR '30' MINUTE, 1);
INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID) VALUES (2, 'Sushi', 'Japanese', INTERVAL '1' HOUR '15' MINUTE, 2);
INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID) VALUES (10, 'Greek Salad', 'Greek', INTERVAL '1' HOUR '30' MINUTE, 3);
INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID) VALUES (28, 'Pizza', 'Italian', INTERVAL '45' MINUTE, 4);
INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID) VALUES (15, 'Chicken Parmesan', 'Italian', INTERVAL '1' HOUR, 5);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (1, 3, 1);
INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (19, 5, 1);
INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (1, 3, 1);
INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (3, 6, 1);
INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES (8, 5, 1);

INSERT INTO Images (ImageURL, Caption) VALUES ('https://xyz.com', 'lasagna');
INSERT INTO Images (ImageURL, Caption) VALUES ('https://xyz1.com', 'sushi');
INSERT INTO Images (ImageURL, Caption) VALUES ('https://xyz2.com', 'pizza');
INSERT INTO Images (ImageURL, Caption) VALUES ('https://xyz3.com', 'ramen');
INSERT INTO Images (ImageURL, Caption) VALUES ('https://xyz4.com', 'chicken parmesan');

INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES ('https://xyz4.com', 88);
INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES ('https://xyz3.com', 56);
INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES ('https://xyz8.com', 34);
INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES ('https://xyz9.com', 10);
INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES ('https://xyz4.com', 24);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES ('tomato', 1, 2);
INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES ('onion', 45, 1);
INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES ('garlic', 3, 5);
INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES ('bell pepper', 5, 2);
INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES ('broccoli', 4, 1);

INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (1, '3 University Drive', 'Vancouver', 'British Columbia');
INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (34, '88 Broadway Street', 'Vancouver', 'British Columbia');
INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (67, '77 Fieldstone Way', 'Toronto', 'Ontario');
INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (34, '90 Orange Road', 'Edmonton', 'Alberta');
INSERT INTO UserLocations (UserID, Street, City, Province) VALUES (99, '8 Blue Willow Drive', 'Vaughan', 'Ontario');

INSERT INTO Locations (Street, City, Province, LocationType) VALUES ('8 Blue Willow Drive', 'Vaughan', 'Ontario', 'home');
INSERT INTO Locations (Street, City, Province, LocationType) VALUES ('90 Yellow Road', 'Vaughan', 'Ontario', 'work');
INSERT INTO Locations (Street, City, Province, LocationType) VALUES ('8 Orange Way', 'Toronto', 'Ontario', 'home');
INSERT INTO Locations (Street, City, Province, LocationType) VALUES ('192 Willow Drive', 'Vancouver', 'British Columbia', 'home');
INSERT INTO Locations (Street, City, Province, LocationType) VALUES ('80 Blue Drive', 'Vaughan', 'Ontario', 'work');

INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES ('80 Blue Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Vaughan', 'Ontario', 2.3);
INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES ('3 Yellow Road', 'Toronto', 'Ontario', '10 Blue Drive', 'Vaughan', 'Ontario', 4.3);
INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES ('230 Brown Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Mississauga', 'Ontario', 8.0);
INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES ('90 Salish Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Markham', 'Ontario', 2.6);
INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES ('80 Pear Drive', 'Vaughan', 'Ontario', '90 Apple Drive', 'Calgary', 'Alberta', 1.9);

INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES ('80 Pear Drive', 'Vaughan', 'Ontario', 'Sue’s Mart');
INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES ('45 Apple Drive', 'Toronto', 'Ontario', 'Loblaw');
INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES ('50 Yellow Way', 'Vaughan', 'Ontario', 'FreshCo');
INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES ('77 Marker Drive', 'Vancouver', 'British Columbia', 'Walmart');
INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES ('33 Mouse Lane', 'Edmonton', 'Alberta', 'Farm Boy');

INSERT INTO UserPantries (UserID, PantryID) VALUES (1, 2);
INSERT INTO UserPantries (UserID, PantryID) VALUES (4, 27);
INSERT INTO UserPantries (UserID, PantryID) VALUES (8, 28);
INSERT INTO UserPantries (UserID, PantryID) VALUES (5, 20);
INSERT INTO UserPantries (UserID, PantryID) VALUES (10, 8);

INSERT INTO SavedPantry (PantryID, Category) VALUES (2, 'work');
INSERT INTO SavedPantry (PantryID, Category) VALUES (4, 'home');
INSERT INTO SavedPantry (PantryID, Category) VALUES (6, 'beach house');
INSERT INTO SavedPantry (PantryID, Category) VALUES (5, 'airbnb');
INSERT INTO SavedPantry (PantryID, Category) VALUES (8, 'airbnb');

INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (3, TO_DATE('2024-07-06', 'YYYY-MM-DD'), 'Broccoli', 1);
INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (10, TO_DATE('2024-08-06', 'YYYY-MM-DD'), 'Bread', 4);
INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (32, TO_DATE('2024-09-03', 'YYYY-MM-DD'), 'Orange', 6);
INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (4, TO_DATE('2024-09-04', 'YYYY-MM-DD'), 'Milk', 3);
INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES (6, TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Lemon', 4);

INSERT INTO FoodItem2 (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES ('broccoli', 0, INTERVAL '36' HOUR, 200, 'vegetable');
INSERT INTO FoodItem2 (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES ('milk', 0, INTERVAL '48' HOUR, 250, 'dairy');
INSERT INTO FoodItem2 (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES ('orange', 0, INTERVAL '98' HOUR, 20, 'fruit');
INSERT INTO FoodItem2 (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES ('pasta', 1, INTERVAL '100' HOUR, 300, 'grains');
INSERT INTO FoodItem2 (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES ('bread', 1, INTERVAL '200' HOUR, 450, 'grains');

INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (3, 'Preheat oven to 350 deg F', 1);
INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (1, 'Chop the onion into cubes', 1);
INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (4, 'Place a pan on high heat', 1);
INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (2, 'Mince 3 garlic cloves', 1);
INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES (8, 'Let the dish cook for 30 minutes', 1);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-07-29', 'YYYY-MM-DD'), 'broccoli');
INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (TO_DATE('2024-05-20', 'YYYY-MM-DD'), TO_DATE('2024-06-01', 'YYYY-MM-DD'), 'milk');
INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (TO_DATE('2024-06-01', 'YYYY-MM-DD'), TO_DATE('2024-06-02', 'YYYY-MM-DD'), 'lemon');
INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (TO_DATE('2024-04-24', 'YYYY-MM-DD'), TO_DATE('2024-05-24', 'YYYY-MM-DD'), 'lime');
INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES (TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-08-30', 'YYYY-MM-DD'), 'bell pepper');

