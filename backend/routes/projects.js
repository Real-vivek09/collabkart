const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middleware/verifyToken');

// GET all projects
router.get('/', projectController.getAllProjects);

// POST create project (secured)
router.post('/', verifyToken, projectController.createProject);

// GET search projects
router.get('/search', projectController.searchProjects);

module.exports = router;
