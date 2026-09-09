// Google Analytics 4 Service

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
  }

  // Initialize GA4
  init() {
    if (this.isInitialized || !this.measurementId) return;
    
    window.dataLayer = window.dataLayer || [];
    this.isInitialized = true;
  }

  // Send gtag events
  gtag(...args) {
    if (window.gtag) {
      window.gtag(...args);
    }
  }

  // Track page view
  pageView(path, title) {
    this.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: this.measurementId
    });
  }

  // Track product view
  viewProduct(product) {
    this.gtag('event', 'view_item', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand_name,
        item_category: product.category,
        price: 0
      }]
    });
  }

  // Track review submission
  submitReview(product, rating, region) {
    this.gtag('event', 'review_submission', {
      item_name: product.name,
      rating: rating,
      region: region,
      value: 1
    });
    
    // Also track as conversion
    this.gtag('event', 'conversion', {
      send_to: this.measurementId,
      value: 1.0,
      currency: 'USD'
    });
  }

  // Track search
  search(searchTerm, resultsCount) {
    this.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // Track helpful vote
  helpfulVote(reviewId, productName) {
    this.gtag('event', 'helpful_vote', {
      review_id: reviewId,
      product_name: productName
    });
  }

  // Track region selection
  selectRegion(regionName) {
    this.gtag('event', 'region_select', {
      region_name: regionName
    });
  }

  // Track outbound link clicks
  outboundClick(url, linkText) {
    this.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      link_text: linkText,
      transport_type: 'beacon'
    });
  }

  // Track form submission
  formSubmit(formName) {
    this.gtag('event', 'form_submit', {
      form_name: formName
    });
  }

  // Track file download
  fileDownload(fileName) {
    this.gtag('event', 'file_download', {
      file_name: fileName
    });
  }

  // Track custom event
  customEvent(eventName, params = {}) {
    this.gtag('event', eventName, params);
  }

  // Track exception/error
  exception(description, fatal = false) {
    this.gtag('event', 'exception', {
      description: description,
      fatal: fatal
    });
  }

  // Set user properties
  setUserProperties(properties) {
    this.gtag('set', 'user_properties', properties);
  }

  // Track timing
  timing(category, variable, value, label) {
    this.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }
}

// Create singleton instance
const analytics = new AnalyticsService();
analytics.init();

export default analytics;