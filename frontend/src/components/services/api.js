// API Service for backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/condom-reviews/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products.php${queryString ? `?${queryString}` : ''}`);
  }

  // Get single product
  async getProduct(id) {
    return this.request(`/products.php?id=${id}`);
  }

  // Search products
  async searchProducts(keyword) {
    return this.request(`/products.php?search=${encodeURIComponent(keyword)}`);
  }

  // Get top product by region
  async getTopProductByRegion(regionId) {
    return this.request(`/products.php?region_top=${regionId}`);
  }

  // Get reviews for a product
  async getReviews(productId, params = {}) {
    const queryString = new URLSearchParams({ 
      product_id: productId, 
      ...params 
    }).toString();
    return this.request(`/reviews.php?${queryString}`);
  }

  // Submit a review
  async submitReview(reviewData) {
    return this.request('/reviews.php', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Mark review as helpful
  async markReviewHelpful(reviewId) {
    return this.request(`/reviews.php?helpful=true&review_id=${reviewId}`, {
      method: 'POST',
    });
  }

  // Get all regions
  async getRegions() {
    return this.request('/regions.php');
  }

  // Get brands (if you have this endpoint)
  async getBrands() {
    return this.request('/brands.php');
  }
}

// Create singleton instance
const api = new ApiService();

export default api;