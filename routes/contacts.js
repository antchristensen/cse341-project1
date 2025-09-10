// routes/contacts.js
const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// GET routes
router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getSingle);

// POST route
router.post('/', contactsController.createContact);

// PUT route
router.put('/:id', contactsController.updateContact);

// DELETE route
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
