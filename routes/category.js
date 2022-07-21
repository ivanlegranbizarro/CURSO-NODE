import express from 'express';
import Category from '../models/category.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categoryList = await Category.find();
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    let category = new Category(req.body);
    return res.status(201).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(204).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      new: true,
    });
    res
      .status(200)
      .json({ message: 'The Category was successfully updated', category });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
