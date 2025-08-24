// Mock payment system for zero-amount payments
const mockPaymentSystem = {
  createOrder: async (amount, currency = 'INR') => {
    // For zero amount payments, return a mock order
    if (amount === 0) {
      return {
        id: `mock_order_${Date.now()}`,
        amount: 0,
        currency: currency,
        status: 'created'
      };
    }
    throw new Error('Only zero-amount payments are supported in demo mode');
  },
  
  verifyPayment: async (paymentId, orderId, signature) => {
    // For zero amount, always return success
    return {
      verified: true,
      paymentId: paymentId,
      orderId: orderId,
      amount: 0
    };
  }
};

exports.instance = mockPaymentSystem;