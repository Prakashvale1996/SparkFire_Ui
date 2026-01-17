import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaBox, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchOrder();
  }, [orderId, orderNumber]);

  useEffect(() => {
    if (order) {
      // Map order status to step
      const statusMap = {
        'Pending': 1,
        'Processing': 2,
        'Shipped': 3,
        'Delivered': 4
      };
      setCurrentStep(statusMap[order.status] || 1);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      let data;
      if (orderNumber) {
        data = await ordersAPI.track(orderNumber);
      } else if (orderId) {
        data = await ordersAPI.getById(orderId);
      }
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Order Not Found</h2>
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { id: 1, name: 'Order Confirmed', icon: <FaCheckCircle />, desc: 'Your order has been placed' },
    { id: 2, name: 'Processing', icon: <FaBox />, desc: 'Preparing your items' },
    { id: 3, name: 'Shipped', icon: <FaTruck />, desc: 'Order is on the way' },
    { id: 4, name: 'Delivered', icon: <FaHome />, desc: 'Order delivered successfully' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Track Your Order</h1>
          <p className="text-gray-400">Order ID: #{orderId}</p>
        </motion.div>

        {/* Tracking Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 mb-8"
        >
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-white/10">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-gold-400 to-primary-500"
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {trackingSteps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: step.id * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{
                      scale: currentStep >= step.id ? 1.1 : 1,
                      backgroundColor: currentStep >= step.id ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-4 border-2 ${
                      currentStep >= step.id ? 'border-gold-400' : 'border-white/10'
                    }`}
                  >
                    {currentStep >= step.id ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-gold-400"
                      >
                        {step.icon}
                      </motion.div>
                    ) : (
                      <div className="text-gray-600">{step.icon}</div>
                    )}
                  </motion.div>
                  <h3 className={`font-semibold mb-1 ${currentStep >= step.id ? 'text-gold-400' : 'text-gray-400'}`}>
                    {step.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">{step.desc}</p>
                  {currentStep === step.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2 px-3 py-1 bg-gold-400/20 rounded-full text-xs text-gold-400"
                    >
                      Current
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-white/10">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gold-400">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-gold-400">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>Delivery Address</span>
              </h2>
              <div className="text-gray-300 space-y-2">
                <p className="font-semibold">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gold-400">Estimated Delivery</h3>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-gold-400 to-primary-600 p-3 rounded-full">
                  <FaTruck className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3-5 Days</p>
                  <p className="text-sm text-gray-400">Standard Delivery</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 bg-gradient-to-r from-gold-500/10 to-primary-600/10 border border-gold-400/20">
              <h3 className="text-lg font-bold mb-3 text-gold-400">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Contact our customer support for any queries regarding your order.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary w-full"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link to="/orders">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              View All Orders
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
