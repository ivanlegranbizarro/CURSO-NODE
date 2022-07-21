import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    await user.save();
    let userWithoutPasswordHash = user.toObject();
    delete userWithoutPasswordHash.passwordHash;
    res.status(201).json(userWithoutPasswordHash);
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send('Invalid email or password');
    }
    const passwordValid = await bcrypt.compare(
      req.body.passwordHash,
      user.passwordHash
    );
    if (!passwordValid) {
      res.status(401).send('Invalid email or password');
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    res.status(200).json({ user: user.email, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.count();
    res.status(200).send({ count: userCount });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'The User was deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});
