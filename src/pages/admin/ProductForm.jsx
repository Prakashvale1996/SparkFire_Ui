import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaUpload, FaImage, FaTrash } from 'react-icons/fa';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Rockets',
    price: '',
    originalPrice: '',
    image: '',
    rating: 4.5,
    reviews: 0,
    inStock: true,
    features: '',
    safety: '',
  });

  const categories = ['Rockets', 'Sparklers', 'Fountains', 'Ground Spinners', 'Aerial Shells', 'Gift Boxes'];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productsAPI.getById(id);
      setFormData({
        ...data,
        features: Array.isArray(data.features) ? data.features.join(', ') : data.features,
        safety: data.safety || '',
      });
      
      if (data.image) {
        setImagePreview(data.image);
        setUploadType(data.image.startsWith('data:') ? 'file' : 'url');
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Update preview for URL input
    if (name === 'image' && uploadType === 'url') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData({
        ...formData,
        image: base64String,
      });
      setImagePreview(base64String);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      };

      if (isEdit) {
        await productsAPI.update(id, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} product`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-400">
            {isEdit ? 'Update product information' : 'Create a new product listing'}
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gold-400">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="Sky Thunder Rocket"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors resize-none"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gold-400">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="899.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Original Price (₹) <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="1299.00"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gold-400">Media</h3>
            
            {/* Upload Type Toggle */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  uploadType === 'file'
                    ? 'bg-gradient-to-r from-gold-400 to-primary-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <FaUpload className="inline mr-2" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadType('url')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  uploadType === 'url'
                    ? 'bg-gradient-to-r from-gold-400 to-primary-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <FaImage className="inline mr-2" />
                Image URL
              </button>
            </div>

            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-gold-400 transition-colors"
                  >
                    <FaUpload className="text-3xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-6 relative">
                <label className="block text-sm font-semibold mb-2">Preview</label>
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gold-400">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Reviews</label>
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 focus:ring-gold-400"
                  />
                  <span className="font-semibold">In Stock</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Features <span className="text-gray-500">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="Height: 150 feet, Duration: 15 seconds, Safety tested"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Safety Information</label>
                <textarea
                  name="safety"
                  value={formData.safety}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors resize-none"
                  placeholder="Keep minimum 25 feet distance. Adult supervision required."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <motion.button
              type="button"
              onClick={() => navigate('/admin/products')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProductForm;
