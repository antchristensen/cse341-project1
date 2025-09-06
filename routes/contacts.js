// routes/contacts.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// GET /contacts 
router.get('/', async (_req, res) => {
  console.log('HIT: GET /contacts');
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find({}).toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('GET /contacts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /contacts/:id 
router.get('/:id', async (req, res) => {
  console.log('HIT: GET /contacts/:id', req.params.id);
  try {
    const id = req.params.id;

    // 400 if not a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });

    // 404 if not found
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error('GET /contacts/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
