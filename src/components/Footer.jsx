import React from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative z-10 glass border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-gold-400 to-primary-600 p-3 rounded-full">
                <FaFire className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">SparkFire</h3>
                <p className="text-xs text-gray-400">Premium Crackers</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for premium quality fireworks and crackers. Light up your celebrations with safety and style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-gold-500 p-2 rounded-full transition-all duration-300">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-gold-500 p-2 rounded-full transition-all duration-300">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-gold-500 p-2 rounded-full transition-all duration-300">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-gold-500 p-2 rounded-full transition-all duration-300">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-gold-400 transition-colors">Products</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-gold-400 transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-gold-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <FaMapMarkerAlt className="text-gold-400 mt-1 flex-shrink-0" />
                <span className="text-sm">123 Celebration Street, Fireworks District, City 560001</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="text-gold-400 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="text-gold-400 flex-shrink-0" />
                <span className="text-sm">info@sparkfire.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SparkFire Crackers. All rights reserved. | Designed with 🎆 for celebration
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Please handle fireworks with care. Follow all safety instructions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
