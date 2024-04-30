require("../models/database");
const { error } = require("console");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Recipe Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Recipe Blog - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Recipe Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Recipe Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Recipe Blog - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Recipe Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Recipe Blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Recipe Blog - Submit",
    infoErrorsObj,
    infoSubmitObj,
  });
};
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      password:req.body.password,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

exports.Contact = async (req, res) => {
  res.render("contact", { title: "Recipe Blog - Contact" });
};

exports.About = async (req, res) => {
  res.render("about", { title: "Recipe Blog - About" });
};
exports.signup = async (req, res) => {
  res.render("signup", { title: "Recipe Blog - About" });
};
exports.deleterecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  let recipeId = req.params.id;
  try{
    const recipe = await Recipe.findById(recipeId);
    res.render("delete-recipe",{title: "Recipe Blog - Delete Recipe", recipe, infoErrorsObj,infoSubmitObj})
  }catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error occurred while fetching recipe for deletion"
    });
  }  
};
exports.deleteOnPost = async (req, res) => {
  let recipeId = req.params.id;
  const { password } = req.body;
  const recipe = await Recipe.findById(recipeId);
  if (recipe.password !== password) {
    req.flash("infoErrors","Incorrect password");
    return res.redirect(`/recipe/${recipeId}/deleteOne`);
  }
  try {
    await Recipe.deleteOne({ _id: recipeId });
    req.flash("infoSubmit", "Recipe has been deleted.");
    // res.redirect(`/categories/${recipe.category}`); // Redirect to homepage after deleting the recipe
    res.redirect('/');
    // alert(`${recipe.name} is Deleted.These are the recipes related to ${recipe.category}`)
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error occurred while deleting recipe" });
  }
};
// Add edit function in your controller
exports.editRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  let recipeId = req.params.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    res.render("edit-recipe", { title: "Recipe Blog - Edit Recipe", recipe, infoErrorsObj,infoSubmitObj });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error occurred while fetching recipe for editing" });
  }
};


// };infoSubmitObj: req.flash("infoSubmit")
// infoErrorsObj: req.flash("infoSubmit")


exports.updateRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const { password } = req.body;

  try {
    // Fetch the recipe from the database
    const recipe = await Recipe.findById(recipeId);

    // Check if the provided password matches the stored password
    if (recipe.password !== password) {
      req.flash("infoErrors","Incorrect password");
      return res.redirect(`/recipe/${recipeId}/edit`);
    }

    // If the password matches, update the recipe
    await Recipe.findByIdAndUpdate(recipeId, req.body);
    res.redirect(`/recipe/${recipeId}`); // Redirect to the recipe page after updating
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error occurred while updating recipe" });
  }
};



// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();

// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


// router.post("/submit-recipe/signup", async (req, res) => {
  // const { username, email, password } = req.body;
  // const user = await usermodel.findOne({ email });
  // if (user) {
  //   return res.json({ status: false, message: "User Already exists" });
  // }
  // const hashpassword = await bcrypt.hash(password, 10);
  // const newUser = new usermodel({
  //   username: username,
  //   password: hashpassword,
  //   email: email,
  // });
  // await newUser.save();
  // return res.json({ status: true, message: "User created successfully" });
  // res.send("done");
// });

