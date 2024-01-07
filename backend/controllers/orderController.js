import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/OrderModel.js';

// @desc    create new order
// @route   POST /api/orders
// @access  private
const addOrderItems = asyncHandler (async (req, res) => {
    const { 
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length ===0) {
        res.status(400);
        throw new Error('No Order Items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});


// @desc    Get logged in user orders
// @route   POST /api/orders/myorders
// @access  private
const getMyOrders = asyncHandler (async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders)
});


// @desc    get order by ID
// @route   GET /api/orders/:id
// @access  private
const getOrderrbyId = asyncHandler (async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


// @desc    update order to paid
// @route   PUT /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler (async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


// @desc    update to delivered
// @route   PUT /api/orders/:id/deliver
// @access  private/admin
const updateOrderToDelivered = asyncHandler (async (req, res) => {
    res.send('update order to delivered');
});


// @desc    get all orders
// @route   POST /api/orders
// @access  private/admin
const getOrders = asyncHandler (async (req, res) => {
    res.send('get all orders');
});

export {
    addOrderItems,
    getMyOrders,
    getOrderrbyId,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};