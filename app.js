//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);



// ----------------------- /articles Route ----------------------- //
app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})
.post(function(req, res){
    const newArt = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArt.save(err=>{
        if(!err){
            res.send("Successfully add new article.");
        }else{
            res.send(err);
        }
    });

})
.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if(!err){
            res.send("Successfully delete all articles.");
        }else{
            res.send(err);
        }
    });
});

// ----------------------- /articles/custom Route ----------------------- //
app.route("/articles/:artTitle")
.get((req, res)=>{
    Article.findOne({title: req.params.artTitle}, (err, tarObj)=>{
        if(tarObj){
            res.send(tarObj);
        }else{
            res.send("No article matching.")
        }
    })
})
// .put((req, res)=>{
//     Article.replaceOne(
//         {title: req.params.artTitle},
//         {title: req.body.title, content: req.body.content},
//         err=>{
//             if(!err){
//                 res.send("Successfully update the article.");
//             }
//         }
//     );
// })
.patch((req, res)=>{
    Article.updateOne(
        {title: req.params.artTitle},
        {$set: req.body},
        err=>{
            if(!err){
                res.send("Successfully update the article.");
            }else{
                res.send(err);
            }
        }
    );
})
.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.artTitle},
        err=>{
            if(!err){
                res.send("Successfully delete the article.");
            }else{
                res.send(err);
            }
        }
    )
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});