// 網站伺服器基本設定//
const express = require("express");
const app = express();
const session = require("express-session");
app.use(session({
    secret: "anything",
    resave: false,
    saveUninitialized: true
}));
app.set("view engin", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//建立需要路由//
app.get("/", async function (req, res) {
    const collection = db.collection("board");
    let result = await collection.find({}).sort({
        time: -1
    });
    let data = [];
    await result.forEach(function (board) {
        data.push(board);
    })
    res.render("index.ejs", { data: data });
});
//啟用伺服器//
app.listen(3000, function () {
    console.log("伺服器啟動成功");
});
// 資料庫連線基本設定 //
const mongo = require("mongodb");
const uri = "mongodb://root:Formosa1412@ac-gfahjzt-shard-00-00.nx1wxbv.mongodb.net:27017,ac-gfahjzt-shard-00-01.nx1wxbv.mongodb.net:27017,ac-gfahjzt-shard-00-02.nx1wxbv.mongodb.net:27017/?ssl=true&replicaSet=atlas-d36lrm-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri);
let db = null;
client.connect(async function (err) {
    if (err) {
        console.log("資料庫連線失敗", err);
        return;
    };
    db = client.db("board-system")
    console.log("資料庫連線成功");
})
app.get("/clean",async function(req,res){
    const collection = db.collection("board"); 
    let result = await collection.deleteMany({});
    console.log("刪除資料數", result.deletedCount);
    res.redirect("/");
})

app.post("/board", async function (req, res) {
    let dt = new Date()
    const name = req.body.name
    const content = req.body.content
    const time = dt.getFullYear() + "/" + dt.getMonth() + "/" + dt.getDate() +" " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
    const collection = db.collection("board"); 
    let result = await collection.insertOne({
        name: name,
        content: content,
        time: time
    })
    res.redirect("/");
})

