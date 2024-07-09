//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://andrumolt:test123@cluster0.jlchpmi.mongodb.net/todolistdb");





async function getItems()
{
  const Items = await Item.find({});
  return Items;
}

async function deleteItems(itemsName)
{
  await Item.findByIdAndDelete(itemsName);
}

async function getLists(listName)
{
  const Lists = await List.findOne({name: listName});
  return Lists;
}






const itemsSchema = {
  name : String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to-do list."
});

const item2 = new Item({
  name: "Hit + to add item."
});

const item3 = new Item({
  name: "Hit this to delete."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);











app.get("/:customListName", function(req, res)
{
  const customListName = req.params.customListName;

//  getLists(customListName);
  console.log(getLists(customListName));

  todolistdb.listCollections();

  const list = new List({
    name: customListName,
    items: defaultItems
  });
  list.save();

});

app.get("/", function(req, res)
{
  getItems().then(function(FoundItems)
{
      if(FoundItems.length === 0)
      {
        Item.insertMany(defaultItems);
      } else {
        res.render("list", {listTitle: "Today", newListItems: FoundItems});
      }
  });
});



app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");


});

app.post("/delete", function(req, res)
{
  const itemId = req.body.checkbox;
  deleteItems(itemId);
  res.redirect("/");


});













// let port = process.env.PORT;
// if (port == null || port == "")
// {
//   port = 3000;
// }

app.listen(3000, function() {
  console.log("Server started succesfully via Heroku.");
});
