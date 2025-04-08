const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require('./ExpressError.js');

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

main()
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/chats", wrapAsync(async (req, res) => {
  let allchats = await Chat.find();
  res.render("index.ejs", { allchats });
}));

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/chats", wrapAsync(async (req, res) => {
  let { to, from, msg } = req.body;
  let newChat = new Chat({
    from,
    to,
    msg,
    created_at: new Date(),
  });

  await newChat.save();
  let allchats = await Chat.find();
  res.render("index.ejs", { allchats });
}));

app.get("/chats/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
}));

app.get("/chats/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
    return next(new ExpressError(404, "Chat not found"));
  }
  res.render("edit.ejs", { chat });
}));

app.put("/chats/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let { newmsg } = req.body;
  await Chat.findByIdAndUpdate(
    id,
    { msg: newmsg },
    { runValidators: true, new: true }
  );
  res.redirect("/chats");
}));

app.delete("/chats/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/chats");
}));

app.use((err, req, res, next) => {
  console.log(err.name);
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occurred" } = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080 : ");
});
