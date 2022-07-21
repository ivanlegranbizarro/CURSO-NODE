import express from 'express';
import Product from '../models/product.js';
import multer from 'multer';

const FILE_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE[file.mimetype];
    let UploadError = new Error('Invalid file type');

    if (isValid) {
      UploadError = null;
    }

    cb(UploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-');
    const extension = FILE_TYPE[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
  try {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}`;
    const completePath = `${basePath}/public/uploads/${fileName}`;
    let product = new Product(req.body);
    product.image = completePath;
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id);
      const basePath = `${req.protocol}://${req.get('host')}`;
      const images = [];
      req.files.forEach((file) => {
        const completePath = `${basePath}/public/uploads/${file.filename}`;
        images.push(completePath);
      });
      product.images = images;
      await product.save();
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.put('/:id', uploadOptions, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      new: true,
    });
    const file = req.file;
    let imagepath;
    if (file) {
      imagepath = `${req.protocol}://${req.get('host')}/public/uploads/${
        file.filename
      }`;
    } else {
      imagepath = product.image;
    }

    res
      .status(200)
      .json({ message: 'The Product was updated successfully', product });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'The Product was deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.count();
    res.status(200).send({ count: productCount });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/get/featured', async (req, res) => {
  try {
    const productFeatured = await Product.find({ isFeatured: true });
    res.status(200).send({ featured: productFeatured });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/get/all', async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category: category });
      res.status(200).send(products);
    } else {
      const products = await Product.find();
      res.status(200).send(products);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
