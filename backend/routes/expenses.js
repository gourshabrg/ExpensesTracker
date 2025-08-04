const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 100, category, startDate, endDate } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: expenses
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
router.get('/stats', async (req, res, next) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;
    
    // Build date filter
    const startDate = month 
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, month, 0)
      : new Date(year, 11, 31);

    // Get expenses for the period
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate total
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group by category
    const categoryStats = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += expense.amount;
      acc[category].count += 1;
      return acc;
    }, {});

    // Group by month (for yearly stats)
    const monthlyStats = expenses.reduce((acc, expense) => {
      const month = expense.date.getMonth();
      const monthName = new Date(0, month).toLocaleString('en', { month: 'long' });
      if (!acc[month]) {
        acc[month] = { month: monthName, amount: 0, count: 0 };
      }
      acc[month].amount += expense.amount;
      acc[month].count += 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalAmount,
        totalExpenses: expenses.length,
        categoryBreakdown: Object.values(categoryStats),
        monthlyBreakdown: Object.values(monthlyStats),
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', [
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .isIn(['food', 'transport', 'entertainment', 'shopping', 'utilities', 'health', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { description, amount, category, date } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      description,
      amount,
      category,
      date: new Date(date)
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', [
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .optional()
    .isIn(['food', 'transport', 'entertainment', 'shopping', 'utilities', 'health', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;