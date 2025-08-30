import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaMoneyBillWave } from 'react-icons/fa';

const Payment = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5001/api/payments/history/${user.uid}`)
        .then(({ data }) => setHistory(data))
        .catch(() => toast.error('Failed to load payment history'));
    }
  }, [user]);

  const handlePayment = async () => {
    try {
      const { data } = await axios.post('http://localhost:5001/api/payments/create-order', { amount }, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      const options = {
        key: data.key,
        amount: amount * 100,
        currency: 'INR',
        order_id: data.orderId,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          await axios.post('http://localhost:5001/api/payments/verify', {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          });
          toast.success('Payment successful!');
          setHistory([...history, { orderId: razorpay_order_id, amount, status: 'completed' }]);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-black to-blue-950 p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">Make a Payment</h2>
      <div className="bg-gray-800 p-8 rounded-xl shadow-neon w-full max-w-md">
        <div className="mb-4">
          <label className="flex items-center text-gray-300"><FaMoneyBillWave className="mr-2" /> Amount (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-900 text-white rounded"
            required
          />
        </div>
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white py-2 rounded hover:scale-105 shadow-neon"
        >
          Pay Now
        </button>
      </div>
      <div className="mt-8 w-full max-w-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Order ID</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((payment) => (
                <tr key={payment.orderId} className="border-b border-gray-700">
                  <td className="p-2">{payment.orderId}</td>
                  <td className="p-2">{payment.amount}</td>
                  <td className="p-2 capitalize">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;