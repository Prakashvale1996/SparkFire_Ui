import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaStar, FaTruck, FaShieldAlt, FaFire } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getCategories()
      ]);
      setProducts(productsData.slice(0, 8)); // Show first 8 products
      
      // Create categories with counts
      const categoryList = categoriesData.map((cat, index) => ({
        name: cat,
        icon: ['✨', '⛲', '🚀', '🌀', '💥', '🎁'][index] || '🎆',
        count: productsData.filter(p => p.category === cat).length,
        gradient: ['from-yellow-400 to-orange-500', 'from-blue-400 to-cyan-500', 
                   'from-red-400 to-pink-500', 'from-purple-400 to-indigo-500',
                   'from-green-400 to-emerald-500', 'from-pink-400 to-rose-500'][index]
      }));
      setCategories(categoryList);
    } catch (error) {
      toast.error('Failed to load products. Please ensure API is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <FaShieldAlt />, title: 'Safety Certified', desc: 'All products are tested and certified' },
    { icon: <FaTruck />, title: 'Fast Delivery', desc: 'Express shipping to your doorstep' },
    { icon: <FaStar />, title: 'Premium Quality', desc: 'Top-grade fireworks for best experience' },
    { icon: <FaFire />, title: '24/7 Support', desc: 'Always here to help you celebrate' },
  ];

  const heroSlides = [
    {
      title: 'Light Up Your Celebrations',
      subtitle: 'Premium Fireworks Collection',
      image: 'https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=1200&q=80',
    },
    {
      title: 'Festival Special Offers',
      subtitle: 'Up to 40% Off on Selected Items',
      image: 'https://images.unsplash.com/photo-1529447738232-072452bb860f?w=1200&q=80',
    },
    {
      title: 'Safety First, Always',
      subtitle: 'Certified & Tested Products',
      image: 'https://images.unsplash.com/photo-1492674109156-e200e8c97546?w=1200&q=80',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="pt-20 relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-[600px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    filter: 'brightness(0.4)'
                  }}
                />
                <div className="relative h-full flex items-center justify-center text-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="max-w-4xl"
                  >
                    <motion.h1 
                      className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {slide.title}
                    </motion.h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link to="/products">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-primary"
                        >
                          Shop Now
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary"
                      >
                        View Catalog
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gradient-to-br from-gold-400 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold-400">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Explore Our Categories
          </h2>
          <p className="text-gray-400 text-lg">
            Find the perfect fireworks for your celebration
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              className="product-card p-6 cursor-pointer group"
            >
              <div className={`text-5xl mb-4 animate-float`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-gold-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-400">{category.count} Products</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              View All Products
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 glass rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Featured Products
          </h2>
          <p className="text-gray-400 text-lg">
            Bestsellers that light up every occasion
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="product-card p-6 group"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save ₹{product.originalPrice - product.price}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-gold-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gold-400">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-gold-500 to-primary-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-shadow"
                    >
                      View
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-primary-600/10 animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Celebrate?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of happy customers and make your events unforgettable
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-12 py-4"
              >
                Start Shopping
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
