const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find({ isActive: true });
        res.status(200).json(categories);

    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getCategoryById = async (req, res) => {
    try{
        const { id } = req.params;

        const category = await Category.findById(id);
        if(!category || !category.isActive){
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createCategory = async (req, res) => {
    try{
        const { title, description, imageUrl } = req.body;

        const existingCategory = await Category.findOne({ title });
        if(existingCategory){
            return res.status(400).json({ message: 'Category with this title already exists' });
        }

        const newCategory = new Category({
            title,
            description,
            imageUrl
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl } = req.body;

        const category = await Category.findById(id);
        if(!category || !category.isActive){
            return res.status(404).json({ message: 'Category not found' });
        }

        category.title = title || category.title;
        category.description = description || category.description;
        category.imageUrl = imageUrl || category.imageUrl;

        await category.save();
        res.status(200).json({ message: 'Category updated successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if(!category || !category.isActive){
            return res.status(404).json({ message: 'Category not found' });
        }

        category.isActive = false;
        await category.save();
        res.status(200).json({ message: 'Category deleted successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}