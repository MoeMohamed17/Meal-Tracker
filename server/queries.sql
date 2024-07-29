CREATE SEQUENCE recipe_seq START WITH 1 INCREMENT BY 1; --need this to create new ID's

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
    UserName VARCHAR(50),
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
    Cuisine VARCHAR(30),
    CookingTime VARCHAR(30),
    UserID INTEGER,
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
    ImageURL VARCHAR(512),
    Caption VARCHAR(512),
    PRIMARY KEY (ImageURL)
);

-- Create ImagesInRecipes table
CREATE TABLE ImagesInRecipes(
    ImageURL VARCHAR(512),
    RecipeID INTEGER,
    PRIMARY KEY (ImageURL, RecipeID),
    FOREIGN KEY (ImageURL) REFERENCES Images(ImageURL),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
);

-- Create Locations table
CREATE TABLE Locations(
    Street VARCHAR(30),
    City VARCHAR(30),
    Province VARCHAR(30),
    LocationType VARCHAR(30),
    PRIMARY KEY (Street, City, Province)
);

-- Create UserLocations table
CREATE TABLE UserLocations(
    UserID INTEGER,
    Street VARCHAR(30),
    City VARCHAR(30),
    Province VARCHAR(30),    
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
    LocationStreet VARCHAR(30),
    LocationCity VARCHAR(30),
    LocationProvince VARCHAR(30),
    GroceryStoreStreet VARCHAR(30),
    GroceryStoreCity VARCHAR(30),
    GroceryStoreProvince VARCHAR(30),
    Distance INTEGER NOT NULL,
    PRIMARY KEY(LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince),
    FOREIGN KEY (LocationStreet, LocationCity, LocationProvince) REFERENCES Locations(Street, City, Province),
    FOREIGN KEY (GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince) REFERENCES GroceryStore(Street, City, Province)
);

-- Create SavedPantry table
CREATE TABLE SavedPantry(
    PantryID INTEGER,
    Category VARCHAR(30),
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
    FoodGroup VARCHAR(30),
    PRIMARY KEY (Calories,FoodGroup)
);

-- Create FoodItem2 table
CREATE TABLE FoodItem2(
    FoodName VARCHAR(30),
    ShelfLife VARCHAR(50),
    Calories INTEGER,
    FoodGroup VARCHAR(30),
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
    InstructionText VARCHAR(512),
    RecipeID INTEGER,
    PRIMARY KEY (StepNum, RecipeID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
        ON DELETE CASCADE
);

-- Create IngredientInstances table
CREATE TABLE IngredientInstances(
    DateAdded DATE,
    ExpiryDate DATE,
    FoodName VARCHAR2(30),
    PRIMARY KEY (DateAdded, FoodName),
    FOREIGN KEY (FoodName) REFERENCES FoodItem2(FoodName)
        ON DELETE CASCADE
);

-- Create IngredientsInPantry table
CREATE TABLE IngredientsInPantry(
    PantryID INTEGER,
    DateAdded DATE,
    FoodName VARCHAR(30),
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (PantryID, DateAdded, FoodName),
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID),
    FOREIGN KEY (DateAdded, FoodName) REFERENCES IngredientInstances(DateAdded, FoodName)
);

--User2
INSERT INTO Users2 (UserID, UserName, Points, UserLevel) 
VALUES (101, 'Alice Johnson', 1500, 5);

INSERT INTO Users2 (UserID, UserName, Points, UserLevel) 
VALUES (102, 'Bob Smith', 1200, 4);

INSERT INTO Users2 (UserID, UserName, Points, UserLevel) 
VALUES (103, 'Charlie Brown', 1800, 6);

INSERT INTO Users2 (UserID, UserName, Points, UserLevel) 
VALUES (104, 'Diana Prince', 1300, 4);

INSERT INTO Users2 (UserID, UserName, Points, UserLevel) 
VALUES (105, 'Evan Thomas', 1600, 5);

--Locations
INSERT INTO Locations (Street, City, Province, LocationType) 
VALUES ('123 Maple Street', 'Vancouver', 'British Columbia', 'Residential');

INSERT INTO Locations (Street, City, Province, LocationType) 
VALUES ('456 Oak Avenue', 'Toronto', 'Ontario', 'Commercial');

INSERT INTO Locations (Street, City, Province, LocationType) 
VALUES ('789 Pine Road', 'Montreal', 'Quebec', 'Industrial');

INSERT INTO Locations (Street, City, Province, LocationType) 
VALUES ('101 Cedar Lane', 'Calgary', 'Alberta', 'Residential');

INSERT INTO Locations (Street, City, Province, LocationType) 
VALUES ('202 Birch Boulevard', 'Halifax', 'Nova Scotia', 'Commercial');


--RecipeCreated1
INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) 
VALUES ('Italian', 5);

INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) 
VALUES ('Chinese', 4);

INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) 
VALUES ('Mexican', 3);

INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) 
VALUES ('Indian', 4);

INSERT INTO RecipeCreated1 (Cuisine, RecipeLevel) 
VALUES ('French', 5);


--RecipeCreated2
INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID)
VALUES (1, 'Spaghetti Carbonara', 'Italian', '00 00:20:00', 101);

INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID)
VALUES (2, 'Sweet and Sour Chicken', 'Chinese', '00 00:30:00', 102);

INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID)
VALUES (3, 'Tacos Al Pastor', 'Mexican', '00 00:25:00', 103);

INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID)
VALUES (4, 'Butter Chicken', 'Indian', '00 00:40:00', 104);

INSERT INTO RecipeCreated2 (RecipeID, RecipeName, Cuisine, CookingTime, UserID)
VALUES (5, 'Coq au Vin', 'French', '00 01:00:00', 105);


--RecipesLiked
INSERT INTO RecipesLiked (RecipeID, UserID, Liked) 
VALUES (1, 101, 1);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) 
VALUES (2, 102, 1);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) 
VALUES (3, 103, 1);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) 
VALUES (4, 104, 0);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) 
VALUES (5, 105, 1);

