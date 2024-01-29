const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const UserPost = require("./db/UserPost"); 
const Jwt = require("jsonwebtoken");
const jwtKey = 'yourSecretKey';
const app = express();


app.use(express.json());
app.use(cors());


// -------------------signup----------------------------

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send("Something went wrong");
    }
    resp.send({ result, auth: token });
  });
});

// ================login================


app.post('/login', async (req, resp) => {
  try {
    if (req.body.password && req.body.email) {
      // Use findOne with a secure query
      const user = await User.findOne({ email: req.body.email, password: req.body.password }).select('-password');
      
      if (user) {
        Jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
          if (err) {
            resp.status(500).json({ error: 'Something went wrong' });
          } else {
            resp.json({ user, auth: token });
          }
        });
      } else {
        resp.status(401).json({ error: 'Invalid login credentials' });
      }
    } else {
      resp.status(400).json({ error: 'Both email and password are required' });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});

//---------user-post---------//

app.post("/add-post", async (req, res) => {
  try {
    const { text, image, userId } = req.body;

    // Basic validation
    if (!text && !image) {
      return res.status(400).json({ error: "Text or image is required." });
    }

    // Create a new UserPost instance
    const post = new UserPost({text, image, userId});

    // Save the post to the database
    const result = await post.save();

    // Send the result back to the client
    res.status(201).json(result);
  } catch (error) {
    console.error("Error during post addition:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await UserPost.find();
  if (posts.length > 0) {
    res.send(posts);
  } else {
    res.send({ result: "No Posts found" });
  }
});

//============delete post===========================//

app.delete("/posts/delete/:id", async (req, resp) => {
  try {
    let result = await UserPost.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    console.error("Error deleting post:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/post/:id", async (req, resp) => {
  let result = await UserPost.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found." });
  }
});

app.put("/post/:id", async (req, resp) => {
  let result = await UserPost.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

app.get("/search/:key", async (req, resp) => {
  let result = await UserPost.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
      // Add more fields as needed for searching
    ],
  });
  resp.send(result);
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
