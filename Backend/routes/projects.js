const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create a new project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("owner");
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner");
    if (!project) {
      return res.status(404).send();
    }
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a project by ID
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).send();
    }
    res.status(200).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a project by ID
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).send();
    }
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
