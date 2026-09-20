import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv"
dotenv.config()


const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY,
);


const createOrder = async (
    orderId,
    orderAmount,
    orderCurrency,
    customerID,
    customerPhone,
) => {

  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();
    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.BACKEND_URL}/payment/verify?orderId=${orderId}`
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await cashfree.PGCreateOrder(request);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getPaymentStatus = async (orderId) => {
    try {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {createOrder , getPaymentStatus}
