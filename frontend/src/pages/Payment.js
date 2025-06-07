import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from '../views/Sidebar';
import Button from '../components/Button';
import axios from 'axios';

const Payment = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      // Fetch Razorpay order from backend
      const { data } = await axios.post('http://localhost:5000/api/payments/create-order', {
        amount: parseFloat(amount),
      });

      // Initialize Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add to .env.local
        amount: data.amount,
        currency: 'INR',
        name: 'CollabKart',
        description: 'Project Payment',
        order_id: data.orderId,
        handler: function (response) {
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          // TODO: Save payment details to MongoDB via backend
        },
        prefill: {
          name: user.displayName || '',
          email: user.email,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
    }
  };

  const mockTransactions = [
    { id: 'txn1', project: 'AI Chatbot', amount: 15000, date: '2025-06-01', status: 'Completed' },
    { id: 'txn2', project: 'E-commerce App', amount: 20000, date: '2025-05-28', status: 'Pending' },
  ];

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-blue-600">Payments</h1>
          </div>
        </header>
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Make a Payment</h2>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    text="Pay Now"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    type="submit"
                  />
                </form>
              </div>
              {/* Transaction History */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-600">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3">Project</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((txn) => (
                        <tr key={txn.id} className="border-t">
                          <td className="p-3">{txn.project}</td>
                          <td className="p-3">₹{txn.amount}</td>
                          <td className="p-3">{txn.date}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                txn.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;