// ASATEC Admin Panel JavaScript

class AdminPanel {
    constructor() {
        // Auto-detect base URL for Vercel deployment
if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app') || hostname.includes('localhost')) {
        this.API_BASE_URL = window.location.origin + '/api';
    } else {
        this.API_BASE_URL = '/api'; // Production with custom domain
    }
} else {
    this.API_BASE_URL = '/api';
}
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeModals();
        this.initializeForms();
        this.loadDashboardData();
        this.bindEvents();
    }

    bindEvents() {
        // Page navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Quick actions
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Add product button
        document.getElementById('addProduct')?.addEventListener('click', () => {
            this.openModal('productModal');
        });

        // View site button
        document.getElementById('viewSite')?.addEventListener('click', () => {
            window.open('/', '_blank');
        });

        // Logout
        document.getElementById('logout')?.addEventListener('click', () => {
            this.logout();
        });

        // Mark all read
        document.getElementById('markAllRead')?.addEventListener('click', () => {
            this.markAllContactsRead();
        });
    }

    initializeNavigation() {
        // Set active page based on hash or default to dashboard
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            this.navigateToPage(hash);
        } else {
            this.navigateToPage('dashboard');
        }
    }

    navigateToPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-page="${pageId}"]`)?.closest('.menu-item');
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update URL
        window.location.hash = pageId;
        this.currentPage = pageId;

        // Load page-specific data
        this.loadPageData(pageId);
    }

    async loadPageData(pageId) {
        switch (pageId) {
            case 'products':
                await this.loadProducts();
                break;
            case 'contacts':
                await this.loadContacts();
                break;
            case 'applications':
                await this.loadApplications();
                break;
            case 'media':
                await this.loadMedia();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'dashboard':
                await this.loadDashboardData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load statistics
            const [products, applications, media, contacts] = await Promise.all([
                this.apiRequest('/admin/products'),
                this.apiRequest('/cases'),
                this.apiRequest('/admin/contacts'),
                this.apiRequest('/admin/contacts')
            ]);

            // Update counters
            this.updateElement('productCount', products?.length || 0);
            this.updateElement('applicationCount', applications?.length || 0);
            this.updateElement('mediaCount', media?.length || 0);
            this.updateElement('contactCount', contacts?.filter(c => c.status === 0)?.length || 0);
            this.updateElement('contactBadge', contacts?.filter(c => c.status === 0)?.length || 0);

            // Load recent activity
            await this.loadRecentActivity();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        // Mock activity data - in real app, this would come from API
        const activities = [
            {
                type: 'product',
                title: 'New product "5G IoT Module" added',
                time: '2 hours ago',
                icon: 'bg-blue'
            },
            {
                type: 'contact',
                title: 'New contact form submission',
                time: '4 hours ago',
                icon: 'bg-red'
            },
            {
                type: 'media',
                title: 'Video "IoT Solutions Overview" uploaded',
                time: '1 day ago',
                icon: 'bg-purple'
            },
            {
                type: 'application',
                title: 'Application case "Smart City" updated',
                time: '2 days ago',
                icon: 'bg-green'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.icon}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    async loadProducts() {
        try {
            this.showLoading('productsTable');
            const products = await this.apiRequest('/admin/products');
            this.renderProductsTable(products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('productsTable', 'Failed to load products');
        }
    }

    renderProductsTable(products) {
        const tbody = document.querySelector('#productsTable tbody');
        if (!tbody) return;

        if (!products || products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">No products found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <img src="${product.imageUrl || 'https://via.placeholder.com/48'}" 
                         alt="${product.title}" class="table-image">
                </td>
                <td>
                    <div>
                        <div class="font-weight-medium">${product.title}</div>
                        <div class="text-muted small">${product.subtitle || ''}</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge">${this.getCategoryName(product.category)}</span>
                </td>
                <td>${product.modelNumber || '-'}</td>
                <td>
                    ${product.isFeatured ? 
                        '<span class="status-badge featured">Featured</span>' : 
                        '<span class="status-badge">Regular</span>'
                    }
                </td>
                <td>
                    <span class="status-badge ${product.isActive ? 'active' : 'inactive'}">
                        ${product.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="adminPanel.editProduct(${product.id})" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.50001C18.8978 2.10218 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10218 21.5 2.50001C21.8978 2.89784 22.1213 3.43739 22.1213 4.00001C22.1213 4.56263 21.8978 5.10218 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteProduct(${product.id})" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3,6 5,6 21,6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadContacts() {
        try {
            this.showLoading('contactsTable');
            const contacts = await this.apiRequest('/admin/contacts');
            this.renderContactsTable(contacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.showError('contactsTable', 'Failed to load contacts');
        }
    }

    renderContactsTable(contacts) {
        const tbody = document.querySelector('#contactsTable tbody');
        if (!tbody) return;

        if (!contacts || contacts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">No contact submissions found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = contacts.map(contact => `
            <tr>
                <td>
                    <div>
                        <div class="font-weight-medium">${contact.firstName} ${contact.lastName}</div>
                        <div class="text-muted small">${contact.company || ''}</div>
                    </div>
                </td>
                <td>
                    <a href="mailto:${contact.email}" class="text-decoration-none">${contact.email}</a>
                </td>
                <td>${contact.subject}</td>
                <td>
                    <span class="status-badge">${this.getContactTypeName(contact.type)}</span>
                </td>
                <td>
                    <span class="status-badge ${this.getContactStatusClass(contact.status)}">
                        ${this.getContactStatusName(contact.status)}
                    </span>
                </td>
                <td>
                    <div class="text-muted small">${this.formatDate(contact.createdAt)}</div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="adminPanel.viewContact(${contact.id})" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke-width="2"/>
                                <circle cx="12" cy="12" r="3" stroke-width="2"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteContact(${contact.id})" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3,6 5,6 21,6" stroke-width="2"/>
                                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Form handling
    initializeForms() {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductSubmit(e.target);
            });
        }
    }

    async handleProductSubmit(form) {
        try {
            const formData = new FormData(form);
            const productData = {
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                description: formData.get('description'),
                technicalSpecs: formData.get('technicalSpecs'),
                imageUrl: formData.get('imageUrl'),
                category: parseInt(formData.get('category')),
                modelNumber: formData.get('modelNumber'),
                isFeatured: formData.has('isFeatured'),
                isActive: true
            };

            const response = await this.apiRequest('/admin/products', 'POST', productData);
            
            this.showAlert('Product added successfully!', 'success');
            this.closeModal('productModal');
            form.reset();
            
            if (this.currentPage === 'products') {
                await this.loadProducts();
            }
            
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('Error saving product:', error);
            this.showAlert('Failed to save product. Please try again.', 'error');
        }
    }

    // Modal handling
    initializeModals() {
        // Close modal buttons
        document.querySelectorAll('.modal-close, [data-close-modal]').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-overlay');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal(overlay.id);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Quick actions
    handleQuickAction(action) {
        switch (action) {
            case 'add-product':
                this.openModal('productModal');
                break;
            case 'add-media':
                this.navigateToPage('media');
                break;
            case 'view-contacts':
                this.navigateToPage('contacts');
                break;
        }
    }

    // API methods
    async apiRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Product actions
    async editProduct(id) {
        // Implement edit product functionality
        console.log('Edit product:', id);
    }

    async deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await this.apiRequest(`/admin/products/${id}`, 'DELETE');
                this.showAlert('Product deleted successfully!', 'success');
                await this.loadProducts();
                await this.loadDashboardData();
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showAlert('Failed to delete product.', 'error');
            }
        }
    }

    // Contact actions
    async viewContact(id) {
        // Implement view contact functionality
        console.log('View contact:', id);
    }

    async deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await this.apiRequest(`/contact/${id}`, 'DELETE');
                this.showAlert('Contact deleted successfully!', 'success');
                await this.loadContacts();
                await this.loadDashboardData();
            } catch (error) {
                console.error('Error deleting contact:', error);
                this.showAlert('Failed to delete contact.', 'error');
            }
        }
    }

    async markAllContactsRead() {
        try {
            await this.apiRequest('/contact/mark-all-read', 'POST');
            this.showAlert('All contacts marked as read!', 'success');
            await this.loadContacts();
            await this.loadDashboardData();
        } catch (error) {
            console.error('Error marking contacts as read:', error);
            this.showAlert('Failed to mark contacts as read.', 'error');
        }
    }

    // Utility methods
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    showLoading(tableId) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="spinner"></div>
                        <div class="mt-2 text-muted">Loading...</div>
                    </td>
                </tr>
            `;
        }
    }

    showError(tableId, message) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">${message}</td>
                </tr>
            `;
        }
    }

    showAlert(message, type = 'info') {
        // Create and show alert notification
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        alert.style.backgroundColor = colors[type] || colors.info;
        
        alert.textContent = message;
        document.body.appendChild(alert);
        
        // Animate in
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 4000);
    }

    getCategoryName(categoryId) {
        const categories = {
            0: 'IoT Modules',
            1: 'Power Solutions',
            2: 'Smart Devices',
            3: 'Connectivity',
            4: 'Automotive'
        };
        return categories[categoryId] || 'Unknown';
    }

    getContactTypeName(typeId) {
        const types = {
            0: 'General',
            1: 'Technical',
            2: 'Sales',
            3: 'Partnership',
            4: 'Media'
        };
        return types[typeId] || 'Unknown';
    }

    getContactStatusName(statusId) {
        const statuses = {
            0: 'New',
            1: 'In Progress',
            2: 'Resolved',
            3: 'Closed'
        };
        return statuses[statusId] || 'Unknown';
    }

    getContactStatusClass(statusId) {
        const classes = {
            0: 'new',
            1: 'active',
            2: 'active',
            3: 'inactive'
        };
        return classes[statusId] || '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Implement logout logic
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login.html';
        }
    }

    // Placeholder methods for other entities
    async loadApplications() {
        // Implement applications loading
        console.log('Loading applications...');
    }

    async loadMedia() {
        // Implement media loading
        console.log('Loading media...');
    }

    async loadUsers() {
        // Implement users loading
        console.log('Loading users...');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});