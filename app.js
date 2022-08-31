const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////// Request Targeting All Articles /////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err)
        res.send(foundArticles);
      else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function(err) {
      if (!err)
        res.send("Successfully added new article!");
      else
        res.send(err);
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err)
        res.send("Articles deleted all Successfully!");
      else
        res.send(err);
    });
  });


  //////////////////////////////// Request Targeting Specific Articles ////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  requestedTitle = req.params.articleTitle;

  Article.findOne({title: requestedTitle}, function(err, foundArticle){
    if(foundArticle)
      res.send(foundArticle);
    else
      res.send("No articles matching that title was found!");
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err)
        res.send("Successfully Updated Article!");
    }
  );
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err)
        res.send("Successfully updated one article!");
      else
        res.send(err);
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err)
        res.send("Successfully deleted one article!");
      else
        res.send(err);
    }
  );
});

app.listen(3000, function() {
  console.log("Server is up and Running");
});
