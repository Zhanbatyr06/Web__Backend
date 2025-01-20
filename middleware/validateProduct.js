module.exports = (req, res, next) => {
    const { name, price, category } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing product name' });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Invalid or missing product price' });
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing product category' });
    }

    next(); // Если валидация успешна, продолжаем выполнение запроса
};
