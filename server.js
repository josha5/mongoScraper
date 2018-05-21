const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const router = express.Router();
const path = require("path");
var logger = require("morgan");
const config = require('./config/database');


app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = Promise;
mongoose.connect(config.database)
.then(() => {
  console.log("Connected to MongoDB database");
})
.catch(err => {
  console.log("There was an error connecting to mongoDB database:" + err);
});

/****************LOAD MODELS ******************/
const db = require("./models");




/***************LOAD ROUTES ****************/
const index = require('./routes/index');
const saved = require('./routes/saved');

/**************MIDDLE WARE **************/
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



/**********************USE ROUTES**************************/
app.use('/', index);
app.use('/saved', saved);


app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.mmanews.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("h3.entry-title").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/index/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
  // Execute the above query
  .exec(function(err, data) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(data);
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Listening on http://localhost:" + PORT);
});