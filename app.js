const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const collection = require('./server/models/Recipe.js')

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js');
const Recipe = require('./server/models/Recipe.js');
app.use('/', routes);

app.post("/submit-recipe/login", (req, res) => {
  res.render("login");
});
// app.post("/submit-recipe/signup", async (req, res) => {
//   const { name, password } = req.body;

//   try {
//     const existingUser = await collection.findOne({ name });

//     if (existingUser) {
//       req.flash("infoErrors", "User already exists. Please choose a different username.");
//       return res.redirect("/submit-recipe");
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new Recipe({
//       name,
//       password: hashedPassword,
//     });

//     const savedUser = await collection.insertOne(newUser);

//     if (savedUser) {
//       req.flash("infoSubmit", "Recipe has been added.");
//       return res.redirect("/submit-recipe");
//     } else {
//       req.flash("infoErrors", "An error occurred while creating the user.");
//       return res.redirect("/submit-recipe");
//     }
//   } catch (error) {
//     console.error(error);
//     req.flash("infoErrors", "An error occurred while creating the user.");
//     res.redirect("/submit-recipe");
//   }
// });



// app.post("/signup", async (req, res) => {

//   const data = {
//       name: req.body.name,
//       password: req.body.password
//   }

//   // Check if the username already exists in the database
//   const existingUser = await collection.findOne({ name: data.name });

//   if (existingUser) {
//       res.send('User already exists. Please choose a different username.');
//   } else {
//       // Hash the password using bcrypt
//       const saltRounds = 10; // Number of salt rounds for bcrypt
//       const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//       data.password = hashedPassword; // Replace the original password with the hashed one

//       const userdata = await collection.insertMany(data);
//       console.log(userdata);
//   }
//   // console.log("hello")
// });


app.listen(port, ()=> console.log(`Listening to port ${port}`));