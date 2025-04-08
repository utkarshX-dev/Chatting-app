const mongoose = require("mongoose");
const Chat = require('./models/chat.js');

main()
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chatroom");
}
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

let allchats = [
    {
        from: "neha",
        to: "priya",
        msg: "Good morning",
        created_at: new Date()
    },
    {
        from: "rahul",
        to: "amit",
        msg: "Hey, how are you?",
        created_at: new Date()
    },
    {
        from: "priya",
        to: "neha",
        msg: "Good morning! How's your day?",
        created_at: new Date()
    },
    {
        from: "aman",
        to: "raj",
        msg: "Let's meet at 5 PM.",
        created_at: new Date()
    },
    {
        from: "sneha",
        to: "ananya",
        msg: "Happy Birthday! 🎉",
        created_at: new Date()
    }
];
Chat.insertMany(allchats);
