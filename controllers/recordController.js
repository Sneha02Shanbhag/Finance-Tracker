const Record = require("../models/Record");

// CREATE record
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Amount must be a valid number" });
    }

    if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ message: "Type must be income or expense" });
    }

    if (!category || category.trim() === "") {
        return res.status(400).json({ message: "Category is required" });
    }

    const record = new Record({ amount, type, category, date });
    await record.save();

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all records with filters
exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (startDate && isNaN(Date.parse(startDate))) {
         return res.status(400).json({ message: "Invalid start date" });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({ message: "Invalid end date" });
    }

    const records = await Record.find(filter).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update record
exports.updateRecord = async (req, res) => {
  try {
    const { amount, type, category } = req.body;

    if (amount && isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (category && category.trim() === "") {
      return res.status(400).json({ message: "Category cannot be empty" });
    }

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete rocords
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//dashboard summary (Total Income, Expense, Balance)
exports.getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((r) => {
      if (r.type === "income") totalIncome += r.amount;
      else totalExpense += r.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//category-wise summary
exports.getCategorySummary = async (req, res) => {
  try {
    const data = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Recent Transactions
exports.getRecent = async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};