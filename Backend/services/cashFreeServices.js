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
        return_url: `http://localhost:3000/api/payment/verify?orderId=${orderId}`
      },
      order_expiry_time: formattedExpiryDate,
    };
    
    console.log("therreee-----------------------------------------")
    const response = await cashfree.PGCreateOrder(request);
    console.log("herrrrrrrr-----------------------------------------")
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};


const getPaymentStatus = async (orderId) => {
    try {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        console.log("responsee of get payment status ..." , response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching payment status:", error);
        throw error;
    }
}

export {createOrder , getPaymentStatus}
