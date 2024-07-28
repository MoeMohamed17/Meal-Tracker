-- Create User table
CREATE TABLE Users(
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
    Cuisine CHAR(30),
    CookingTime INTERVAL DAY TO SECOND,
    UserID INTEGER NOT NULL,
    PRIMARY KEY (RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);

-- Create RecipesLiked table
CREATE TABLE RecipesLiked(
    RecipeID INTEGER,
    UserID INTEGER,
    Liked NUMBER(1),
    PRIMARY KEY (RecipeID, UserID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
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

-- Create FoodsInRecipes table
CREATE TABLE FoodsInRecipes(
    FoodName VARCHAR2(30),
    RecipeID INTEGER,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (FoodName, RecipeID),
    FOREIGN KEY (FoodName) REFERENCES FoodItem(FoodName),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated2(RecipeID)
);

-- Create Location table
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
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (Street, City, Province) REFERENCES Locations(Street, City, Province)
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

-- Create GroceryStore table
CREATE TABLE GroceryStore(
    Street VARCHAR2(30),
    City VARCHAR2(30),
    Province VARCHAR2(30),
    StoreName VARCHAR2(30) NOT NULL,
    PRIMARY KEY (Street, City, Province)
);

-- Create UserPantries table
CREATE TABLE UserPantries(
    UserID INTEGER,
    PantryID INTEGER,
    PRIMARY KEY (UserID, PantryID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID)
);

-- Create SavedPantry table
CREATE TABLE SavedPantry(
    PantryID INTEGER,
    Category CHAR(30),
    PRIMARY KEY (PantryID)
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

-- Create FoodItem table
CREATE TABLE FoodItem(
    FoodName VARCHAR2(30),
    Healthy NUMBER(1),
    ShelfLife INTERVAL DAY TO SECOND,
    Calories INTEGER,
    FoodGroup VARCHAR2(30),
    PRIMARY KEY (FoodName)
);

-- Create StepContains table
CREATE TABLE StepContains(
    StepNum INTEGER,
    InstructionText VARCHAR2(512) NOT NULL,
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
    FOREIGN KEY (FoodName) REFERENCES FoodItem(FoodName)
        ON DELETE CASCADE
);

-- Insert statements
INSERT INTO Users (UserID, UserName, Points, UserLevel) VALUES 
(1, 'Karen', 300, 6),
(2, 'Moe', 87, 9),
(3, 'Chris', 303, 8),
(300, 'Bob', 65, 4),
(499, 'Joe', 0, 1);

INSERT INTO RecipeCreated2 (RecipeID, Cuisine, CookingTime, UserID) VALUES 
(1, 'Italian', INTERVAL '1' HOUR '30' MINUTE, 1),
(2, 'Japanese', INTERVAL '1' HOUR '15' MINUTE, 2),
(10, 'Greek', INTERVAL '1' HOUR '30' MINUTE, 3),
(28, 'Italian', INTERVAL '45' MINUTE, 4),
(15, 'Italian', INTERVAL '1' HOUR, 5);

INSERT INTO RecipesLiked (RecipeID, UserID, Liked) VALUES 
(1, 3, 1),
(19, 5, 1),
(1, 3, 1),
(3, 6, 1),
(8, 5, 1);

INSERT INTO Images (ImageURL, Caption) VALUES 
('https://xyz.com', 'lasagna'),
('https://xyz1.com', 'sushi'),
('https://xyz2.com', 'pizza'),
('https://xyz3.com', 'ramen'),
('https://xyz4.com', 'chicken parmesan');

INSERT INTO ImagesInRecipes (ImageURL, RecipeID) VALUES 
('https://xyz4.com', 88),
('https://xyz3.com', 56),
('https://xyz8.com', 34),
('https://xyz9.com', 10),
('https://xyz4.com', 24);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity) VALUES 
('tomato', 1, 2),
('onion', 45, 1),
('garlic', 3, 5),
('bell pepper', 5, 2),
('broccoli', 4, 1);

INSERT INTO UserLocations (UserID, Street, City, Province) VALUES 
(1, '3 University Drive', 'Vancouver', 'British Columbia'),
(34, '88 Broadway Street', 'Vancouver', 'British Columbia'),
(67, '77 Fieldstone Way', 'Toronto', 'Ontario'),
(34, '90 Orange Road', 'Edmonton', 'Alberta'),
(99, '8 Blue Willow Drive', 'Vaughan', 'Ontario');

INSERT INTO Locations (Street, City, Province, LocationType) VALUES 
('8 Blue Willow Drive', 'Vaughan', 'Ontario', 'home'),
('90 Yellow Road', 'Vaughan', 'Ontario', 'work'),
('8 Orange Way', 'Toronto', 'Ontario', 'home'),
('192 Willow Drive', 'Vancouver', 'British Columbia', 'home'),
('80 Blue Drive', 'Vaughan', 'Ontario', 'work');

INSERT INTO NearbyStores (LocationStreet, LocationCity, LocationProvince, GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince, Distance) VALUES 
('80 Blue Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Vaughan', 'Ontario', 2.3),
('3 Yellow Road', 'Toronto', 'Ontario', '10 Blue Drive', 'Vaughan', 'Ontario', 4.3),
('230 Brown Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Mississauga', 'Ontario', 8.0),
('90 Salish Drive', 'Vaughan', 'Ontario', '90 Blue Drive', 'Markham', 'Ontario', 2.6),
('80 Pear Drive', 'Vaughan', 'Ontario', '90 Apple Drive', 'Calgary', 'Alberta', 1.9);

INSERT INTO GroceryStore (Street, City, Province, StoreName) VALUES 
('80 Pear Drive', 'Vaughan', 'Ontario', 'Sue’s Mart'),
('45 Apple Drive', 'Toronto', 'Ontario', 'Loblaw'),
('50 Yellow Way', 'Vaughan', 'Ontario', 'FreshCo'),
('77 Marker Drive', 'Vancouver', 'British Columbia', 'Walmart'),
('33 Mouse Lane', 'Edmonton', 'Alberta', 'Farm Boy');

INSERT INTO UserPantries (UserID, PantryID) VALUES 
(1, 2),
(4, 27),
(8, 28),
(5, 20),
(10, 8);

INSERT INTO SavedPantry (PantryID, Category) VALUES 
(2, 'work'),
(4, 'home'),
(6, 'beach house'),
(5, 'airbnb'),
(8, 'airbnb');

INSERT INTO IngredientsInPantry (PantryID, DateAdded, FoodName, Quantity) VALUES 
(3, TO_DATE('2024-07-06', 'YYYY-MM-DD'), 'Broccoli', 1),
(10, TO_DATE('2024-08-06', 'YYYY-MM-DD'), 'Bread', 4),
(32, TO_DATE('2024-09-03', 'YYYY-MM-DD'), 'Orange', 6),
(4, TO_DATE('2024-09-04', 'YYYY-MM-DD'), 'Milk', 3),
(6, TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Lemon', 4);

INSERT INTO FoodItem (FoodName, Healthy, ShelfLife, Calories, FoodGroup) VALUES 
('broccoli', 0, INTERVAL '36' HOUR, 200, 'vegetable'),
('milk', 0, INTERVAL '48' HOUR, 250, 'dairy'),
('orange', 0, INTERVAL '98' HOUR, 20, 'fruit'),
('pasta', 1, INTERVAL '100' HOUR, 300, 'grains'),
('bread', 1, INTERVAL '200' HOUR, 450, 'grains');

INSERT INTO StepContains (StepNum, InstructionText, RecipeID) VALUES 
(3, 'Preheat oven to 350 deg F', 1),
(1, 'Chop the onion into cubes', 1),
(4, 'Place a pan on high heat', 1),
(2, 'Mince 3 garlic cloves', 1),
(8, 'Let the dish cook for 30 minutes', 1);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName) VALUES 
(TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-07-29', 'YYYY-MM-DD'), 'broccoli'),
(TO_DATE('2024-05-20', 'YYYY-MM-DD'), TO_DATE('2024-06-01', 'YYYY-MM-DD'), 'milk'),
(TO_DATE('2024-06-01', 'YYYY-MM-DD'), TO_DATE('2024-06-02', 'YYYY-MM-DD'), 'lemon'),
(TO_DATE('2024-04-24', 'YYYY-MM-DD'), TO_DATE('2024-05-24', 'YYYY-MM-DD'), 'lime'),
(TO_DATE('2024-07-20', 'YYYY-MM-DD'), TO_DATE('2024-08-30', 'YYYY-MM-DD'), 'bell pepper');


-- Select all users
SELECT * FROM Users;

-- Select a specific user by UserID
SELECT * FROM Users WHERE UserID = 1;

-- Select all recipes from RecipeCreated1
SELECT * FROM RecipeCreated1;