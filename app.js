const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true,useUnifiedTopology: true});
const wikiSchema ={
title:String,
content:String

};
const Articles = mongoose.model("Articles", wikiSchema);
////////////////////////////////////////request targeting all routes//////
app.route("/articles")
  .get(function(req,res) {

   Articles.find({},function (err,foundArticles) {
    if(!err){
   res.send(foundArticles);
   }
     else {
     console.log(err);
   }
  //console.log(foundArticles);
   });
    })
.post(function(req,res) {
  const artTitle = req.body.title;
  const artbody = req.body.content;
  const newArticle = new Articles({
    title:artTitle,
    content:artbody
  });
  newArticle.save(function (err) {
    if (!err) {
      res.send("data send sucsesfully");

    }else {
      res.send(err);
    }
  });
})

.delete(function(req,res) {
  Articles.deleteMany(function(err) {
    if (!err) {
          res.send("all grete");
    }
    else {
          res.send(err);
    }

  })
});
////////////////////////////////////////request targeting spasific route//////
app.route("/articles/:articleTitle")
.get(function(req,res) {
  Articles.findOne({title:req.params.articleTitle},function(err,foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);

    }else {
      res.send("nothing there");
    }

  });
})
.put(function(req,res) {
  Articles.update(
   {title:req.params.articleTitle},
   {title:req.body.title, content:req.body.content},
   {overwrite:true},
   function(err) {
     if (!err) {
       res.send("all is greate");
     }
   }
  )

})
.patch(function(req,res) {
  Articles.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function (err) {
      if(!err)
      {
        res.send("update done");
      }
      else {
        res.send(err);
      }
    }
  );

})
.delete(function(req,res) {
  Articles.findOneAndDelete(
    {title:req.params.articleTitle},
    function (err) {
      if(!err)
      {
        res.send("delete done");
      }
      else {
        res.send(err);
      }
    }
  );

});



















app.listen(3000, function() {
  console.log("Server started 3000");
});
