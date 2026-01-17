import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa';
import { useOrderStore } from '../store/store';

const MyOrders = () => {
  const orders = useOrderStore((state) => state.orders);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'processing':
        return 'text-blue-500 bg-blue-500/20';
      case 'shipped':
        return 'text-purple-500 bg-purple-500/20';
      case 'delivered':
        return 'text-green-500 bg-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock />;
      case 'delivered':
        return <FaCheckCircle />;
      default:
        return <FaBox />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-3xl font-bold mb-4 gradient-text">No Orders Yet</h2>
          <p className="text-gray-400 mb-8">Start shopping to see your orders here!</p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <Link to={`/track/${order.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaEye />
                    <span>Track Order</span>
                  </motion.button>
                </Link>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gold-400">₹{item.price}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400">+{order.items.length - 3} more items</p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/10">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-400 mb-1">Delivery Address</p>
                  <p className="text-sm">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Order Total</p>
                  <p className="text-2xl font-bold text-gold-400">₹{order.total.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
        >
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">{orders.length}</div>
            <p className="text-gray-400">Total Orders</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-gray-400">Pending</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {orders.filter(o => o.status === 'shipped').length}
            </div>
            <p className="text-gray-400">Shipped</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <p className="text-gray-400">Delivered</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyOrders;
