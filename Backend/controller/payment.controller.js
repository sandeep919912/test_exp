import Orders from "../models/order.model.js";
import User from "../models/user.model.js";
import { createOrder, getPaymentStatus } from "../services/cashFreeServices.js";

const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "user not found" });
    }

    const orderId = `ORDER_${userId}_${Date.now()}`;

    const orderAmount = 599;
    const orderCurrency = "INR";

    const cashFreeOrder = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      String(userId),
      "9199124294",
    );

    console.log(cashFreeOrder);

    await Orders.create({
      orderId,

      userId,

      amount: orderAmount,

      paymentSessionId: cashFreeOrder.payment_session_id,

      status: "PENDING",
    });

    res.status(201).json({
      orderId,
      paymentSessionId: cashFreeOrder.payment_session_id,
    });
  } catch (error) {
    console.log("error in payment controller ................ ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Orders.findOne({
      where: { orderId },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const payments = await getPaymentStatus(orderId);

    const payment = payments[0];

    if (payment.payment_status === "SUCCESS") {
      await order.update({
        status: "SUCCESSFUL",
      });

      // PENDING → SUCCESSFUL
      await User.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: order.userId,
          },
        },
      );
      return res.json({
        status: "SUCCESSFUL",
        message: "Transaction successful",
      });
    }

    if (payment.payment_status === "FAILED") {
      // PENDING → FAILED
      await order.update({
        status: "FAILED",
      });
      return res.json({
        status: "FAILED",
        message: "TRANSACTION FAILED.",
      });
    }

    res.json({
      status: "PENDING",
      message: "Payment is pending",
    });
  } catch (error) {
    console.log("Error in verify payment:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { createPayment, verifyPayment };
