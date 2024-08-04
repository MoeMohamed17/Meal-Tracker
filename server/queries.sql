BEGIN
    FOR rel IN (SELECT table_name FROM user_tables) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || rel.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
    FOR seq IN (SELECT sequence_name FROM user_sequences) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || seq.sequence_name;
    END LOOP;
    FOR tri IN (SELECT trigger_name FROM user_triggers) LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || tri.trigger_name;
    END LOOP;
END;
/

-- Create Users table
CREATE TABLE Users(
    UserID INTEGER,
    UserName VARCHAR(50) UNIQUE,
    Points INTEGER DEFAULT 0,
    PRIMARY KEY (UserID)
);

CREATE SEQUENCE UserIncrement START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER UserTrigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
  SELECT UserIncrement.NEXTVAL INTO :NEW.UserID FROM dual;
END;
/

-- Create UserLevels table
CREATE TABLE UserLevels(
    Points INTEGER,
    UserLevel INTEGER,
    PRIMARY KEY (Points)
);

-- Create RecipeCreated table
CREATE TABLE RecipeCreated(
    RecipeID INTEGER,
    RecipeName VARCHAR(50),
    Cuisine VARCHAR(30),
    CookingTime VARCHAR(30),
    UserID INTEGER,
    PRIMARY KEY (RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE SET NULL
);

CREATE SEQUENCE RecipeIncrement START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER RecipeTrigger
BEFORE INSERT ON RecipeCreated
FOR EACH ROW
BEGIN
  SELECT RecipeIncrement.NEXTVAL INTO :NEW.RecipeID FROM dual;
END;
/

-- Create RecipeLevels table
CREATE TABLE RecipeLevels(
    Cuisine VARCHAR(30),
    RecipeLevel INTEGER,
    PRIMARY KEY (Cuisine)
);

-- Create RecipesLiked table
CREATE TABLE RecipesLiked(
    RecipeID INTEGER,
    UserID INTEGER,
    PRIMARY KEY (RecipeID, UserID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated(RecipeID)
    ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
);

-- Create Images table
CREATE TABLE Images(
    ImageURL VARCHAR(512),
    Caption VARCHAR(512),
    RecipeID INTEGER,
    PRIMARY KEY (ImageURL, RecipeID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated(RecipeID)
    ON DELETE CASCADE
);

-- -- Create ImagesInRecipes table
-- CREATE TABLE ImagesInRecipes(
--     ImageURL VARCHAR(512),
--     RecipeID INTEGER,
--     PRIMARY KEY (ImageURL, RecipeID),
--     FOREIGN KEY (ImageURL) REFERENCES Images(ImageURL)
--     ON DELETE CASCADE,
--     FOREIGN KEY (RecipeID) REFERENCES RecipeCreated(RecipeID)
--     ON DELETE CASCADE
-- );

-- Create StepContains table
CREATE TABLE StepContains(
    StepNum INTEGER,
    InstructionText VARCHAR(512) NOT NULL,
    RecipeID INTEGER,
    PRIMARY KEY (StepNum, RecipeID),
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated(RecipeID)
        ON DELETE CASCADE
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
    PRIMARY KEY (UserID, Street, City, Province),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE,
    FOREIGN KEY (Street, City, Province) REFERENCES Locations(Street, City, Province)
    ON DELETE CASCADE
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
    FOREIGN KEY (LocationStreet, LocationCity, LocationProvince) REFERENCES Locations(Street, City, Province)
    ON DELETE CASCADE,
    FOREIGN KEY (GroceryStoreStreet, GroceryStoreCity, GroceryStoreProvince) REFERENCES GroceryStore(Street, City, Province)
    ON DELETE CASCADE
);

-- Create SavedPantry table
CREATE TABLE SavedPantry(
    PantryID INTEGER,
    Category VARCHAR(30),
    PRIMARY KEY (PantryID)
);

CREATE SEQUENCE PantryIncrement START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER PantryTrigger
BEFORE INSERT ON SavedPantry
FOR EACH ROW
BEGIN
  SELECT PantryIncrement.NEXTVAL INTO :NEW.PantryID FROM dual;
END;
/

-- Create UserPantries table
CREATE TABLE UserPantries(
    UserID INTEGER,
    PantryID INTEGER,
    PRIMARY KEY (UserID, PantryID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE,
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID)
        ON DELETE CASCADE
);

-- Create FoodItem table
CREATE TABLE FoodItem(
    FoodName VARCHAR(30),
    ShelfLife VARCHAR(50),
    Calories INTEGER,
    FoodGroup VARCHAR(30),
    PRIMARY KEY (FoodName)
);

-- Create HealthyLookup table
CREATE TABLE HealthyLookup(
    Calories INTEGER,
    FoodGroup VARCHAR(30),
    Healthy NUMBER(1),
    PRIMARY KEY (Calories, FoodGroup)
);

-- Create FoodsInRecipes table
CREATE TABLE FoodsInRecipes(
    FoodName VARCHAR(30),
    RecipeID INTEGER,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (FoodName, RecipeID),
    FOREIGN KEY (FoodName) REFERENCES FoodItem(FoodName)
    ON DELETE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES RecipeCreated(RecipeID)
    ON DELETE CASCADE
);

-- IngredientInstances table
CREATE TABLE IngredientInstances(
    DateAdded DATE,
    ExpiryDate DATE,
    FoodName VARCHAR(30),
    PantryID INTEGER,
    Quantity INTEGER,
    PRIMARY KEY (DateAdded, FoodName, PantryID),
    FOREIGN KEY (FoodName) REFERENCES FoodItem(FoodName)
        ON DELETE CASCADE,
    FOREIGN KEY (PantryID) REFERENCES SavedPantry(PantryID)
        ON DELETE CASCADE
);



-- User
INSERT INTO Users (UserName) VALUES ('AliceJohnson');
INSERT INTO Users (UserName, Points) VALUES ('BobSmith', 50);
INSERT INTO Users (UserName, Points) VALUES ('CharlieBrown', 150);
INSERT INTO Users (UserName, Points) VALUES ('DianaPrince', 250);
INSERT INTO Users (UserName, Points) VALUES ('EvanThomas', 350);
INSERT INTO Users (UserName, Points) VALUES ('FionaGreen', 450);
INSERT INTO Users (UserName, Points) VALUES ('GeorgeWhite', 550);
INSERT INTO Users (UserName, Points) VALUES ('HannahBlue', 650);
INSERT INTO Users (UserName, Points) VALUES ('IsaacGray', 750);
INSERT INTO Users (UserName, Points) VALUES ('JuliaBlack', 850);
INSERT INTO Users (UserName, Points) VALUES ('KevinRed', 950);

-- UserLevels
INSERT INTO UserLevels (Points, UserLevel) VALUES (0, 1);
INSERT INTO UserLevels (Points, UserLevel) VALUES (100, 2);
INSERT INTO UserLevels (Points, UserLevel) VALUES (200, 3);
INSERT INTO UserLevels (Points, UserLevel) VALUES (300, 4);
INSERT INTO UserLevels (Points, UserLevel) VALUES (400, 5);
INSERT INTO UserLevels (Points, UserLevel) VALUES (500, 6);
INSERT INTO UserLevels (Points, UserLevel) VALUES (600, 7);
INSERT INTO UserLevels (Points, UserLevel) VALUES (700, 8);
INSERT INTO UserLevels (Points, UserLevel) VALUES (800, 9);
INSERT INTO UserLevels (Points, UserLevel) VALUES (900, 10);

-- Locations
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


-- RecipeLevels
INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Italian', 1);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Chinese', 1);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Mexican', 2);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Indian', 3);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('French', 4);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Thai', 5);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Ethiopian', 6);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Brazilian', 7);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Japanese', 8);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Lebanese', 9);

INSERT INTO RecipeLevels (Cuisine, RecipeLevel) 
VALUES ('Greek', 10);


-- RecipeCreated
INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Spaghetti Carbonara', 'Italian', '00 00:20:00', 6);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Sweet and Sour Chicken', 'Chinese', '00 00:30:00', 8);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Tacos Al Pastor', 'Mexican', '00 00:25:00', 9);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Butter Chicken', 'Indian', '00 00:40:00', 9);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Coq au Vin', 'French', '00 01:00:00', 2);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Pad Thai', 'Thai', '00 00:30:00', 4);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Lentil Stew', 'Ethiopian', '00 01:00:00', 5);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Feijoada', 'Brazilian', '00 05:00:00', 11);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Chicken Katsu Don', 'Japanese', '00 00:30:00', 7);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Tabbouleh', 'Lebanese', '00 00:45:00', 9);

INSERT INTO RecipeCreated (RecipeName, Cuisine, CookingTime, UserID)
VALUES ('Moussaka', 'Greek', '00 02:00:00', 11);


-- RecipesLiked
INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (1, 1);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (2, 2);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (3, 3);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (4, 4);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (5, 5);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (6, 6);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (7, 7);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (8, 8);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (9, 9);

INSERT INTO RecipesLiked (RecipeID, UserID) 
VALUES (10, 10);

-- Insert statements for Images table
INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-square640-v2.jpg', 'A delicious plate of Spaghetti Carbonara', 1);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://thecozycook.com/wp-content/uploads/2022/03/Sweet-and-Sour-Chicken-f5.jpg', 'Sweet and Sour Chicken served with rice', 2);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://iamafoodblog.b-cdn.net/wp-content/uploads/2021/05/al-pastor-3507w.jpg', 'Traditional Tacos Al Pastor with pineapple', 3);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://moribyan.com/wp-content/uploads/2022/05/IMG_4902-scaled-e1609906617281-1.jpg', 'Butter Chicken with creamy sauce', 4);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://images.services.kitchenstories.io/9GIeqQwpeGj8Te6zRGt07XzEETo=/3840x0/filters:quality(80)/images.kitchenstories.io/wagtailOriginalImages/R23-final-photo-4.jpg', 'Classic French Coq au Vin', 5);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://inquiringchef.com/wp-content/uploads/2023/02/Authentic-Pad-Thai_square-1908.jpg', 'Authentic Pad Thai noodles', 6);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://holycowvegan.net/wp-content/uploads/2023/02/ethiopian-lentil-stew-recipe-1.jpg', 'Ethiopian Lentil Stew', 7);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://www.allrecipes.com/thmb/Cr3iNBwelHE5F_uUqLcbzcaEY18=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/351366-feijoada-brazilian-black-bean-stew-Melissa-Goff-4x3-1-0fb041cc43234fedb23d171172e65a10.jpg', 'Traditional Brazilian Feijoada', 8);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://www.justonecookbook.com/wp-content/uploads/2021/04/Chicken-Katsudon-9331.jpg', 'Japanese Chicken Katsu Don', 9);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://feelgoodfoodie.net/wp-content/uploads/2023/09/Lebanese-Tabbouleh-Salad-TIMG.jpg', 'Fresh Lebanese Tabbouleh', 10);

INSERT INTO Images (ImageURL, Caption, RecipeID)
VALUES ('https://www.mygreekdish.com/wp-content/uploads/2013/05/Moussaka-recipe-Traditional-Greek-Moussaka-with-Eggplants.jpg', 'Layered Greek Moussaka', 11);


-- -- Insert statements for ImagesInRecipes table
-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-square640-v2.jpg', 1);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://thecozycook.com/wp-content/uploads/2022/03/Sweet-and-Sour-Chicken-f5.jpg', 2);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://iamafoodblog.b-cdn.net/wp-content/uploads/2021/05/al-pastor-3507w.jpg', 3);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://moribyan.com/wp-content/uploads/2022/05/IMG_4902-scaled-e1609906617281-1.jpg', 4);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://images.services.kitchenstories.io/9GIeqQwpeGj8Te6zRGt07XzEETo=/3840x0/filters:quality(80)/images.kitchenstories.io/wagtailOriginalImages/R23-final-photo-4.jpg', 5);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://inquiringchef.com/wp-content/uploads/2023/02/Authentic-Pad-Thai_square-1908.jpg', 6);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://holycowvegan.net/wp-content/uploads/2023/02/ethiopian-lentil-stew-recipe-1.jpg', 7);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://www.allrecipes.com/thmb/Cr3iNBwelHE5F_uUqLcbzcaEY18=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/351366-feijoada-brazilian-black-bean-stew-Melissa-Goff-4x3-1-0fb041cc43234fedb23d171172e65a10.jpg', 8);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://www.justonecookbook.com/wp-content/uploads/2021/04/Chicken-Katsudon-9331.jpg', 9);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://feelgoodfoodie.net/wp-content/uploads/2023/09/Lebanese-Tabbouleh-Salad-TIMG.jpg', 10);

-- INSERT INTO ImagesInRecipes (ImageURL, RecipeID)
-- VALUES ('https://www.mygreekdish.com/wp-content/uploads/2013/05/Moussaka-recipe-Traditional-Greek-Moussaka-with-Eggplants.jpg', 11);

-- multi image test
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 1);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 2);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 3);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 4);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 5);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 6);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 7);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 8);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 9);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 10);
INSERT INTO Images(ImageURL, Caption, RecipeID)
VALUES('https://www.thepackagingcompany.com/knowledge-sharing/wp-content/uploads/2018/10/ip-mcdonalds-blog.jpg', 'Testing testing 123', 11);


-- StepContains
INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff1.', 1);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat1.', 1);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff2.', 2);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat2.', 2);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff3.', 3);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat3.', 3);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff4.', 4);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat4.', 4);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff5.', 5);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat5.', 5);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff6.', 6);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat6.', 6);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff7.', 7);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat7.', 7);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff8.', 8);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat8.', 8);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff9.', 9);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat9.', 9);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff10.', 10);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat10.', 10);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (1, 'Do stuff11.', 11);

INSERT INTO StepContains (StepNum, InstructionText, RecipeID)
VALUES (2, 'Eat11.', 11);

-- Locations table
INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('1190 Richelieu Ave', 'Vancouver', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('899 W 12th Ave', 'Vancouver', 'British Columbia', 'Work');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('2517 Tempe Knoll Dr', 'North Vancouver', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('695 E 19th Ave', 'Vancouver', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('2929 Barnet Hwy', 'Coquitlam', 'British Columbia', 'Work');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('31 Gilmore Ave', 'Burnaby', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('809 Robson St', 'Vancouver', 'British Columbia', 'Work');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('14156 Melrose Dr', 'Surrey', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('10931 Seaward Gate', 'Richmond', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('1800 W 6th Ave', 'Vancouver', 'British Columbia', 'Work');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('3700 W 8th Ave', 'Vancouver', 'British Columbia', 'Home');

INSERT INTO Locations (Street, City, Province, LocationType)
VALUES ('1500 W Broadway', 'Vancouver', 'British Columbia', 'Work');

-- UserLocations
INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (1, '1190 Richelieu Ave', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (2, '899 W 12th Ave', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (3, '2517 Tempe Knoll Dr', 'North Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (4, '695 E 19th Ave', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (5, '2929 Barnet Hwy', 'Coquitlam', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (6, '31 Gilmore Ave', 'Burnaby', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (7, '809 Robson St', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (8, '14156 Melrose Dr', 'Surrey', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (9, '10931 Seaward Gate', 'Richmond', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (10, '1800 W 6th Ave', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (11, '3700 W 8th Ave', 'Vancouver', 'British Columbia');

INSERT INTO UserLocations (UserID, Street, City, Province)
VALUES (11, '1500 W Broadway', 'Vancouver', 'British Columbia');

-- SavedPantry table
INSERT INTO SavedPantry (Category)
VALUES ('Home');

INSERT INTO SavedPantry (Category)
VALUES ('Work');

INSERT INTO SavedPantry (Category)
VALUES ('Home');

INSERT INTO SavedPantry (Category)
VALUES ('Backpack');

INSERT INTO SavedPantry (Category)
VALUES ('Pantry');

INSERT INTO SavedPantry (Category)
VALUES ('Home');

INSERT INTO SavedPantry (Category)
VALUES ('Home');

INSERT INTO SavedPantry (Category)
VALUES ('Cupboard');

INSERT INTO SavedPantry (Category)
VALUES ('Work');

INSERT INTO SavedPantry (Category)
VALUES ('Home');

INSERT INTO SavedPantry (Category)
VALUES ('Work');

INSERT INTO SavedPantry (Category)
VALUES ('Work');

-- UserPantries table
INSERT INTO UserPantries (UserID, PantryID)
VALUES (1, 1);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (2, 2);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (3, 3);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (4, 4);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (5, 5);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (6, 6);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (7, 7);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (8, 8);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (9, 9);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (10, 10);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (11, 11);

INSERT INTO UserPantries (UserID, PantryID)
VALUES (1, 12);

-- Create FoodItem table
INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Chicken', '3 00:00:00', 300, 'Meat');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Potatoes', '14 00:00:00', 200, 'Vegetable');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Olive oil', '3650 00:00:00', 400, 'Fat');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Uncooked rice', '3650 00:00:00', 400, 'Carbohydrate');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Uncooked noodles', '3650 00:00:00', 300, 'Carbohydrate');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Butter', '90 00:00:00', 500, 'Fat');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Ground beef', '3 00:00:00', 400, 'Meat');

INSERT INTO FoodItem (FoodName, ShelfLife, Calories, FoodGroup)
VALUES ('Sliced ham', '4 00:00:00', 300, 'Meat');


-- Create HealthyLookup table
INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (300, 'Meat', 0);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (0, 'Meat', 1);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (1000, 'Vegetable', 0);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (0, 'Vegetable', 1);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (500, 'Fat', 0);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (0, 'Fat', 1);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (400, 'Carbohydrate', 0);

INSERT INTO HealthyLookup (Calories, FoodGroup, Healthy)
VALUES (0, 'Carbohydrate', 1);

-- FoodsInRecipes
INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Chicken', 1, 1);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Potatoes', 2, 2);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Olive oil', 3, 3);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Uncooked rice', 4, 4);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Uncooked noodles', 5, 5);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Butter', 6, 6);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Ground beef', 7, 7);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Sliced ham', 8, 8);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Chicken', 9, 9);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Potatoes', 10, 10);

INSERT INTO FoodsInRecipes (FoodName, RecipeID, Quantity)
VALUES ('Olive oil', 11, 11);


-- IngredientInstances table
INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-01 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-04 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 1, 1);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-02 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-05 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Ground beef', 1, 2);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-03 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-07 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Sliced ham', 1, 3);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-02 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-05 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 2, 2);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-03 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-06 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 3, 3);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-04 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-07 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 4, 4);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-05 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-08 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 5, 5);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-06 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-09 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 6, 6);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-07 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-10 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 7, 7);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-08 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-11 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 8, 8);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-09 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-12 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 9, 9);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-10 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-13 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 10, 10);

INSERT INTO IngredientInstances (DateAdded, ExpiryDate, FoodName, PantryID, Quantity)
VALUES (TO_DATE('2024-07-11 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2024-07-14 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chicken', 11, 11);
