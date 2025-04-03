const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Chat = require('./models/chat.js');
const methodOverride = require("method-override"); 
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chatroom");
}

app.listen(8080, () => {
  console.log("Server is running on port 8080 : ");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/chats", async (req, res) => {
  let allchats = await Chat.find();
  res.render("index.ejs",{allchats});
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});
app.post("/chats", async (req, res) => {
  try {
    let { to, from, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });

    await newChat.save();
    let allchats = await Chat.find();
    res.render("index.ejs",{allchats});
  } catch (err) {
    res.send('error in saving chats')
  }
});

app.get("/chats/:id/edit",async(req,res)=>{
  let {id} = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs",{chat});
})
//update route
app.put("/chats/:id",async(req,res)=>{
  let {id} = req.params;
  let {newmsg} = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(id,{msg : newmsg},{runValidators : true,new : true})
  res.redirect("/chats");
})
//delete msg
app.delete("/chats/:id",async(req,res)=>{
  let {id} = req.params;
  console.log(id);
   let deleteChat = await Chat.findByIdAndDelete(id);
   res.redirect("/chats");
   console.log(deleteChat);
})