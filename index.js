const express= require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const multer = require('multer');
// ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique filename
    }
  });
const upload = multer({ storage });

let posts = [
    {
        id: uuidv4(),
        username: "Suvam",
        content: "Lets code",
        image:null
    },
    {
        id:uuidv4(),
        username: "ainu",
        content: "thaaaiiii",
        image: null
    },
    {
        id:uuidv4(),
        username: "suna",
        content: "i love pringles",
        image: null
    },
];
app.get("/", (req, res) =>
    res.redirect("/posts")
);
app.get("/posts", (req, res) =>
    res.render("index.ejs", {posts})
);
app.get("/posts/new", (req, res) =>
    res.render("new.ejs"))

app.post("/posts", upload.single('image'), (req, res) => {
    const { username, content } = req.body;
    const image = req.file ? req.file.filename : null; // Check if the image was uploaded
    const id = uuidv4();
    
    // Create a new post with the image
    posts.push({ id, username, content, image });
    
    res.redirect("/posts");
});
// app.post("/posts", (req, res) => {
//     let {username, content,image} = req.body;
//     let id = uuidv4();
//     posts.push({id, username, content,image});
//     // res.send("post req working");
//     res.redirect("/posts");
// });

app.get('/posts/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);
    res.render('show.ejs', { post });
});

app.patch("/posts/:id", upload.single('image'), (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);

    post.content = req.body.content || post.content;
    post.username = req.body.username || post.username;

    if (req.file) {
        post.image = req.file.filename;
    }

    console.log(post);
    res.redirect("/posts");
});
app.get("/posts/:id/edit", (req, res) => {
    let {id}= req.params;
    let post = posts.find((p) => id === p.id);
   res.render("edit.ejs", {post}); });

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});