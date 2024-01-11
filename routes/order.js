const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// Create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Update 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get User Order
router.get("/find/:userid", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userid });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date(); 

    // Create a copy of the current date for last month
    const lastMonth = new Date(date);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Create a copy of the last month for the month before that
    const previousMonth = new Date(lastMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    console.log(lastMonth, previousMonth);
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router