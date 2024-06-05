const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Routes import
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const projectRoutes = require("./routes/projects");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://danny:1234@cluster0.tqjlbig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/taskbucket",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDBss", err);
  });

//  routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Task Management System API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
