const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ---------------------------------------------------------------------
// Adding sessions
const sessionOptions = {
    secret : "mysecretcode",
    resave: false,
    saveUninitialized : true,
    cookie:{
        expire: Date.now() + 7 * 25 * 60 * 60 * 1000,
        maxAge: 7 * 25 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());
// ---------------------------------------------------------------------

// DATABASE CONNECTION
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/BookRama");
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);  // Exits the app if DB fails
    }
}

main();

// Start server
const port = 6060;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ---------------------------------------------------------------------
// middleware for message flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.deleted = req.flash("deleted");
    res.locals.edited = req.flash("edited");
    next();
});

// ---------------------------------------------------------------------
// Redirecting to the landing page
app.get('/', (req, res) => {
    res.render('landing');
});



// ---------------------------------------------------------------------
// Redirecting to the listing router
app.use("/listings", listings);

// ---------------------------------------------------------------------
// Redirecting to the reviews router
app.use("/listings/:id/reviews", reviews);

// --------------------------------------------------------------------------
// General error responder
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// --------------------------------------------------------------------------
// User login / signup
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// --------------------------------------------------------------------------
// Custom error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});
