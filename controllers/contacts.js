// controllers/contacts.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// Helper: validate required fields
function hasAllFields(body) {
  const { firstName, lastName, email, favoriteColor, birthday } = body || {};
  return Boolean(firstName && lastName && email && favoriteColor && birthday);
}

// GET all
exports.getAll = async (_req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find({}).toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('GET /contacts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET single
exports.getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    console.error('GET /contacts/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST create
exports.createContact = async (req, res) => {
  try {
    if (!hasAllFields(req.body)) {
      return res.status(400).json({
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday',
      });
    }

    const db = getDb();
    const result = await db.collection('contacts').insertOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('POST /contacts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT update
exports.updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }
    if (!hasAllFields(req.body)) {
      return res.status(400).json({
        error: 'All fields are required for PUT: firstName, lastName, email, favoriteColor, birthday',
      });
    }

    const db = getDb();
    const result = await db.collection('contacts').replaceOne(
      { _id: new ObjectId(id) },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('PUT /contacts/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE
exports.deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const db = getDb();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /contacts/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
