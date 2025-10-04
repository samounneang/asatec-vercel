// ASATEC Website API Client

class AsatecAPI {
    constructor(baseURL = null) {
        // Auto-detect base URL for Vercel deployment
        if (!baseURL) {
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                if (hostname.includes('vercel.app') || hostname.includes('localhost')) {
                    this.baseURL = window.location.origin + '/api';
                } else {
                    this.baseURL = '/api'; // Production with custom domain
                }
            } else {
                this.baseURL = '/api';
            }
        } else {
            this.baseURL = baseURL;
        }
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed. Please try again later.');
            throw error;
        }
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Products API
    async getProducts(filters = {}) {
        return this.get('/products', filters);
    }

    async getProduct(id) {
        return this.get(`/products/${id}`);
    }

    async getProductCategories() {
        return this.get('/products/categories');
    }

    // Media API
    async getMediaItems(filters = {}) {
        return this.get('/media', filters);
    }

    async getMediaItem(id) {
        return this.get(`/media/${id}`);
    }

    async getMediaTypes() {
        return this.get('/media/types');
    }

    // Contact API
    async submitContactForm(formData) {
        return this.post('/contact', formData);
    }

    async getContactInfo() {
        return this.get('/contact/info');
    }

    // Application Cases API
    async getApplicationCases(filters = {}) {
        return this.get('/cases', filters);
    }

    async getApplicationCase(id) {
        return this.get(`/cases/${id}`);
    }

    // Page Content API
    async getPageContent(pageName) {
        return this.get(`/content/${pageName}`);
    }

    // Search API
    async search(query, filters = {}) {
        return this.get('/search', { query, ...filters });
    }
}

// Form Handler Class
class FormHandler {
    constructor(api) {
        this.api = api;
        this.forms = new Map();
        this.initializeForms();
    }

    initializeForms() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.forms.set('contact', contactForm);
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            this.forms.set('newsletter', newsletterForm);
            newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
        }

        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            this.forms.set('search', searchForm);
            searchForm.addEventListener('submit', this.handleSearchForm.bind(this));
        }
    }

    async handleContactForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            this.showFormLoading(form);
            
            const response = await this.api.submitContactForm(data);
            
            this.showFormSuccess(form, 'Thank you for your message! We will get back to you soon.');
            form.reset();
            
        } catch (error) {
            this.showFormError(form, 'There was an error submitting your message. Please try again.');
        } finally {
            this.hideFormLoading(form);
        }
    }

    async handleNewsletterForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        
        try {
            this.showFormLoading(form);
            
            // Implement newsletter subscription logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            this.showFormSuccess(form, 'Successfully subscribed to our newsletter!');
            form.reset();
            
        } catch (error) {
            this.showFormError(form, 'There was an error subscribing. Please try again.');
        } finally {
            this.hideFormLoading(form);
        }
    }

    async handleSearchForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const query = formData.get('query');
        
        if (!query.trim()) return;
        
        try {
            this.showFormLoading(form);
            
            const results = await this.api.search(query);
            this.displaySearchResults(results);
            
        } catch (error) {
            this.showFormError(form, 'Search failed. Please try again.');
        } finally {
            this.hideFormLoading(form);
        }
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-small"></div> Sending...';
        }
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
        }
    }

    showFormSuccess(form, message) {
        this.clearFormMessages(form);
        const messageEl = this.createMessageElement(message, 'success');
        form.appendChild(messageEl);
        
        setTimeout(() => {
            if (form.contains(messageEl)) {
                form.removeChild(messageEl);
            }
        }, 5000);
    }

    showFormError(form, message) {
        this.clearFormMessages(form);
        const messageEl = this.createMessageElement(message, 'error');
        form.appendChild(messageEl);
        
        setTimeout(() => {
            if (form.contains(messageEl)) {
                form.removeChild(messageEl);
            }
        }, 5000);
    }

    clearFormMessages(form) {
        const messages = form.querySelectorAll('.form-message');
        messages.forEach(msg => form.removeChild(msg));
    }

    createMessageElement(message, type) {
        const div = document.createElement('div');
        div.className = `form-message alert alert-${type}`;
        div.innerHTML = `<p>${message}</p>`;
        return div;
    }

    displaySearchResults(results) {
        // Implement search results display
        console.log('Search results:', results);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
            
            // Email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        input.parentNode.appendChild(errorEl);
        input.classList.add('error');
    }

    clearFieldError(input) {
        const errorEl = input.parentNode.querySelector('.form-error');
        if (errorEl) {
            input.parentNode.removeChild(errorEl);
        }
        input.classList.remove('error');
    }
}

// Content Loader Class
class ContentLoader {
    constructor(api) {
        this.api = api;
        this.cache = new Map();
    }

    async loadProducts(container, filters = {}) {
        if (!container) return;
        
        try {
            this.showLoadingState(container);
            
            const cacheKey = `products-${JSON.stringify(filters)}`;
            let products;
            
            if (this.cache.has(cacheKey)) {
                products = this.cache.get(cacheKey);
            } else {
                products = await this.api.getProducts(filters);
                this.cache.set(cacheKey, products);
            }
            
            this.renderProducts(container, products);
            
        } catch (error) {
            this.showErrorState(container, 'Failed to load products');
        }
    }

    async loadMediaItems(container, filters = {}) {
        if (!container) return;
        
        try {
            this.showLoadingState(container);
            
            const cacheKey = `media-${JSON.stringify(filters)}`;
            let mediaItems;
            
            if (this.cache.has(cacheKey)) {
                mediaItems = this.cache.get(cacheKey);
            } else {
                mediaItems = await this.api.getMediaItems(filters);
                this.cache.set(cacheKey, mediaItems);
            }
            
            this.renderMediaItems(container, mediaItems);
            
        } catch (error) {
            this.showErrorState(container, 'Failed to load media');
        }
    }

    showLoadingState(container) {
        container.innerHTML = `
            <div class="loading-overlay">
                <div class="spinner"></div>
            </div>
        `;
    }

    showErrorState(container, message) {
        container.innerHTML = `
            <div class="alert alert-error">
                <p>${message}</p>
            </div>
        `;
    }

    renderProducts(container, products) {
        if (!products || products.length === 0) {
            container.innerHTML = '<p>No products found.</p>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="card product-card" data-product-id="${product.id}">
                <img src="${product.imageUrl}" alt="${product.title}" class="card-image">
                <div class="card-body">
                    <h3 class="card-title">${product.title}</h3>
                    <p class="card-text">${product.description}</p>
                    <a href="/products/${product.id}" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        `).join('');
    }

    renderMediaItems(container, mediaItems) {
        if (!mediaItems || mediaItems.length === 0) {
            container.innerHTML = '<p>No media items found.</p>';
            return;
        }
        
        container.innerHTML = mediaItems.map(item => `
            <div class="video-card" data-media-id="${item.id}">
                <div class="video-thumbnail">
                    <img src="${item.thumbnailUrl}" alt="${item.title}">
                    <div class="play-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${item.title}</h3>
                    <p class="video-description">${item.description}</p>
                    <div class="video-meta">
                        <span>${item.duration}</span>
                        <span>${item.viewCount} views</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export classes for use in other modules
window.AsatecAPI = AsatecAPI;
window.FormHandler = FormHandler;
window.ContentLoader = ContentLoader;

// Initialize API client
window.api = new AsatecAPI();
window.formHandler = new FormHandler(window.api);
window.contentLoader = new ContentLoader(window.api);