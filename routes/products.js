const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET endpoints
    // GET all products
    router.get('/', async (req,res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } 
    });

    // GET one product with ID
    router.get('/:id', async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: 'Product not found' })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

// POST endpoints
    // POST one product
    router.post('/', async (req,res) => {
        let product;
        try {
            product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                stock: req.body.stock
            });
        } catch (error) {
            res.status(500).json({ message: 'Unable to create product ' + error.message });
        }

        try {
            const newProduct = await product.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ message: 'Unable to save product ' + error.message });
        }
    });

// DELETE endpoints
    // DELETE all products
    router.post('/', async (req,res) => {
    }) 

    module.exports = router;
    
    // DELETE one prodcut
    //
    //

// MODIFY endpoints
    // MODIGY one product