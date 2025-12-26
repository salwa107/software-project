/* ==================== SCRIPT.JS ====================
   This file contains all the JavaScript logic for the
   QuickDeliver Online Ordering System - Egyptian Version
   
   SECTIONS:
   1. Data Models (Users, Products, Cart, Orders)
   2. Sample Data with Egyptian Names
   3. Authentication Functions (Login/Signup)
   4. Display Functions
   5. Customer Functions (Cart, Checkout, Payment)
   6. Admin Functions (Product Approval)
   7. Service Offeror Functions
   8. Courier Functions
   9. Utility Functions
   
   ================================================== */

/* ==================== SECTION 1: DATA MODELS ====================
   These describe the structure of our data.
   Each "object" represents an entity in our system.
   =============================================================== */

/**
 * USER (Base)
 * The base user object that all user types inherit from.
 * Properties:
 *   - id: unique identifier
 *   - name: user's full name (Egyptian names)
 *   - email: user's email address
 *   - password: user's password
 *   - role: type of user (customer, admin, serviceOfferor, courier)
 */

/**
 * PRODUCT
 * Represents an item that can be purchased.
 * Properties:
 *   - id: unique identifier
 *   - name: product name
 *   - price: cost in Egyptian Pounds (EGP)
 *   - category: type of product (Pizza, Burgers, Drinks, Desserts)
 *   - status: "pending" (awaiting approval) or "approved" (visible to customers)
 *   - ownerId: ID of the service offeror who owns this product
 *   - ownerName: Name of the service offeror (displayed on product)
 */

/**
 * ORDER
 * Represents a customer's order.
 * Properties:
 *   - id: unique identifier
 *   - customerId: ID of the customer
 *   - items: array of products ordered
 *   - totalPrice: total cost in EGP
 *   - status: current status (pending, preparing, on-the-way, delivered, cancelled)
 *   - paymentMethod: "cash" (pay on delivery) or "card" (credit card)
 *   - date: when the order was placed
 *   - assignedCourier: ID of the courier
 */

/* ==================== SECTION 2: SAMPLE DATA ====================
   Pre-populated data with Egyptian names and EGP currency.
   =============================================================== */

// Currently logged in user (null until login)
let currentUser = null;

// Array to store all users in the system (Egyptian names)
let users = [
    {
        id: 1,
        name: "أحمد حسن",           // Ahmed Hassan
        email: "ahmed@email.com",
        password: "123456",
        role: "customer",
        cart: [],
        orders: []
    },
    {
        id: 2,
        name: "محمد صلاح",          // Mohamed Salah
        email: "admin@email.com",
        password: "admin123",
        role: "admin"
    },
    {
        id: 3,
        name: "مطعم بيتزا كينج",     // Pizza King Restaurant
        email: "pizza@email.com",
        password: "pizza123",
        role: "serviceOfferor",
        ownedProducts: [1, 2, 3]
    },
    {
        id: 4,
        name: "نور الدين",           // Nour El-Din
        email: "nour@email.com",
        password: "nour123",
        role: "courier",
        deliveryArea: "وسط البلد",
        assignedOrders: []
    },
    {
        id: 5,
        name: "فاطمة علي",          // Fatma Ali
        email: "fatma@email.com",
        password: "fatma123",
        role: "customer",
        cart: [],
        orders: []
    },
    {
        id: 6,
        name: "سلمى مصطفى",         // Salma Mostafa
        email: "salma@email.com",
        password: "salma123",
        role: "customer",
        cart: [],
        orders: []
    },
    {
        id: 7,
        name: "مطعم برجر هاوس",      // Burger House Restaurant
        email: "burger@email.com",
        password: "burger123",
        role: "serviceOfferor",
        ownedProducts: [4, 5]
    },
    {
        id: 8,
        name: "كريم محمود",          // Karim Mahmoud
        email: "karim@email.com",
        password: "karim123",
        role: "courier",
        deliveryArea: "المعادي",
        assignedOrders: []
    }
];

// Array to store all products (prices in EGP - Egyptian Pounds)
let products = [
    {
        id: 1,
        name: "بيتزا مارجريتا",       // Margherita Pizza
        price: 90,
        category: "Pizza",
        status: "approved",          // Already approved by admin
        ownerId: 3,
        ownerName: "مطعم بيتزا كينج",
        icon: "🍕"
    },
    {
        id: 2,
        name: "بيتزا بيبروني",        // Pepperoni Pizza
        price: 120,
        category: "Pizza",
        status: "approved",
        ownerId: 3,
        ownerName: "مطعم بيتزا كينج",
        icon: "🍕"
    },
    {
        id: 3,
        name: "بيتزا خضروات",         // Vegetable Pizza
        price: 85,
        category: "Pizza",
        status: "approved",
        ownerId: 3,
        ownerName: "مطعم بيتزا كينج",
        icon: "🍕"
    },
    {
        id: 4,
        name: "برجر لحم كلاسيك",      // Classic Beef Burger
        price: 75,
        category: "Burgers",
        status: "approved",
        ownerId: 7,
        ownerName: "مطعم برجر هاوس",
        icon: "🍔"
    },
    {
        id: 5,
        name: "برجر دجاج مقرمش",      // Crispy Chicken Burger
        price: 65,
        category: "Burgers",
        status: "approved",
        ownerId: 7,
        ownerName: "مطعم برجر هاوس",
        icon: "🍔"
    },
    {
        id: 6,
        name: "عصير برتقال طازج",     // Fresh Orange Juice
        price: 25,
        category: "Drinks",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍊"
    },
    {
        id: 7,
        name: "كوكاكولا",             // Coca Cola
        price: 15,
        category: "Drinks",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🥤"
    },
    {
        id: 8,
        name: "كنافة نابلسية",        // Nabulsi Kunafa
        price: 45,
        category: "Desserts",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍰"
    },
    {
        id: 9,
        name: "أم علي",               // Om Ali (Egyptian dessert)
        price: 35,
        category: "Desserts",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍮"
    },
    {
        id: 10,
        name: "بيتزا سي فود",         // Seafood Pizza - PENDING approval
        price: 150,
        category: "Pizza",
        status: "pending",           // Waiting for admin approval
        ownerId: 3,
        ownerName: "مطعم بيتزا كينج",
        icon: "🍕"
    }
];

// Array to store all orders
let orders = [
    {
        id: 1001,
        customerId: 1,
        customerName: "أحمد حسن",
        items: [
            { name: "بيتزا مارجريتا", price: 90, quantity: 1 },
            { name: "كوكاكولا", price: 15, quantity: 2 }
        ],
        totalPrice: 120,
        status: "preparing",
        paymentMethod: "cash",
        date: "2025-12-25",
        assignedCourier: 4
    }
];

// Shopping cart for the current customer
let cart = [];

// Variable to track selected product for editing
let selectedProductId = null;

// Current category filter
let currentCategoryFilter = "all";

// Counters for generating unique IDs
let nextProductId = 11;
let nextOrderId = 1002;
let nextUserId = 9;

/* ==================== SECTION 3: AUTHENTICATION FUNCTIONS ====================
   Functions for login and signup (simulated - no real authentication).
   =========================================================================== */

/**
 * showAuthTab(tab)
 * Switches between Login and Signup forms.
 * @param {string} tab - Either "login" or "signup"
 */
function showAuthTab(tab) {
    // Get the form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Get the tab buttons
    const tabs = document.querySelectorAll('.auth-tab');
    
    // Remove active class from all tabs
    tabs.forEach(function(t) {
        t.classList.remove('active');
    });
    
    // Show the correct form and highlight the correct tab
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabs[1].classList.add('active');
    }
}

/**
 * handleLogin(event)
 * Handles the login form submission.
 * Checks if user exists and password matches.
 * @param {Event} event - The form submit event
 */
function handleLogin(event) {
    // Prevent the form from refreshing the page
    event.preventDefault();
    
    // Get the form values
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user with matching email
    const user = users.find(function(u) {
        return u.email === email;
    });
    
    // Check if user exists
    if (!user) {
        showToast('البريد الإلكتروني غير مسجل!', 'error');
        return;
    }
    
    // Check if password matches
    if (user.password !== password) {
        showToast('كلمة المرور غير صحيحة!', 'error');
        return;
    }
    
    // Login successful - set current user
    currentUser = user;
    
    // Show success message
    showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
    
    // Redirect to the main app
    redirectToRolePage();
}

/**
 * handleSignup(event)
 * Handles the signup form submission.
 * Creates a new user account.
 * @param {Event} event - The form submit event
 */
function handleSignup(event) {
    // Prevent the form from refreshing the page
    event.preventDefault();
    
    // Get the form values
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    // Validate that a role is selected
    if (!role) {
        showToast('الرجاء اختيار نوع الحساب!', 'error');
        return;
    }
    
    // Check if email already exists
    const existingUser = users.find(function(u) {
        return u.email === email;
    });
    
    if (existingUser) {
        showToast('البريد الإلكتروني مسجل بالفعل!', 'error');
        return;
    }
    
    // Create new user object
    const newUser = {
        id: nextUserId,
        name: name,
        email: email,
        password: password,
        role: role
    };
    
    // Add role-specific properties
    if (role === 'customer') {
        newUser.cart = [];
        newUser.orders = [];
    } else if (role === 'serviceOfferor') {
        newUser.ownedProducts = [];
    } else if (role === 'courier') {
        newUser.deliveryArea = 'غير محدد';
        newUser.assignedOrders = [];
    }
    
    // Add user to the users array
    users.push(newUser);
    
    // Increment the user ID counter
    nextUserId++;
    
    // Set as current user and login
    currentUser = newUser;
    
    // Show success message
    showToast('تم إنشاء الحساب بنجاح! مرحباً بك 🎉', 'success');
    
    // Redirect to the main app
    redirectToRolePage();
}

/**
 * redirectToRolePage()
 * Hides the login page and shows the main app.
 * Displays the correct section based on user role.
 */
function redirectToRolePage() {
    // Hide the login page
    document.getElementById('loginPage').classList.add('hidden');
    
    // Show the main app
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update the welcome message with user name
    document.getElementById('welcomeUser').textContent = 'مرحباً، ' + currentUser.name;
    
    // Update the role badge
    const roleBadge = document.getElementById('userRoleBadge');
    const roleNames = {
        'customer': 'عميل',
        'admin': 'مدير',
        'serviceOfferor': 'مقدم خدمة',
        'courier': 'مندوب توصيل'
    };
    roleBadge.textContent = roleNames[currentUser.role];
    
    // Show/hide the admin link in footer
    const userAccountsLink = document.getElementById('userAccountsLink');
    if (currentUser.role === 'admin') {
        userAccountsLink.classList.remove('hidden');
    } else {
        userAccountsLink.classList.add('hidden');
    }
    
    // Hide all role sections first
    document.getElementById('customerSection').classList.add('hidden');
    document.getElementById('adminSection').classList.add('hidden');
    document.getElementById('serviceOfferorSection').classList.add('hidden');
    document.getElementById('courierSection').classList.add('hidden');
    
    // Show the correct section based on role
    if (currentUser.role === 'customer') {
        document.getElementById('customerSection').classList.remove('hidden');
        displayProducts();
        displayCart();
        displayCustomerOrders();
    } else if (currentUser.role === 'admin') {
        document.getElementById('adminSection').classList.remove('hidden');
        displayPendingProducts();
        displayAdminProducts();
        displayAllUsers();
    } else if (currentUser.role === 'serviceOfferor') {
        document.getElementById('serviceOfferorSection').classList.remove('hidden');
        displayServiceProducts();
    } else if (currentUser.role === 'courier') {
        document.getElementById('courierSection').classList.remove('hidden');
        displayCourierOrders();
    }
}

/**
 * logout()
 * Logs out the current user and returns to login page.
 */
function logout() {
    // Clear current user
    currentUser = null;
    
    // Clear cart
    cart = [];
    
    // Hide main app
    document.getElementById('mainApp').classList.add('hidden');
    
    // Show login page
    document.getElementById('loginPage').classList.remove('hidden');
    
    // Clear login form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    // Show login tab
    showAuthTab('login');
    
    showToast('تم تسجيل الخروج', 'success');
}

/* ==================== SECTION 4: DISPLAY FUNCTIONS ====================
   Functions that update what the user sees on the screen.
   ===================================================================== */

/**
 * filterByCategory(category)
 * Filters products by category.
 * @param {string} category - The category to filter by, or "all" for all products
 */
function filterByCategory(category) {
    // Update current filter
    currentCategoryFilter = category;
    
    // Update active button
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.textContent.includes(category) || (category === 'all' && btn.textContent.includes('الكل'))) {
            btn.classList.add('active');
        }
    });
    
    // Re-display products with filter
    displayProducts();
}

/**
 * displayProducts()
 * Shows APPROVED products to customers (grouped by category filter).
 * Only shows products with status = "approved".
 */
function displayProducts() {
    // Get the container where products will be displayed
    const productsList = document.getElementById('productsList');
    
    // Clear any existing products
    productsList.innerHTML = '';
    
    // Filter products: only approved ones
    let filteredProducts = products.filter(function(product) {
        return product.status === 'approved';
    });
    
    // Apply category filter if not "all"
    if (currentCategoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(function(product) {
            return product.category === currentCategoryFilter;
        });
    }
    
    // Check if no products found
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<p class="no-orders">لا توجد منتجات في هذا التصنيف</p>';
        return;
    }
    
    // Loop through each product and create a card
    filteredProducts.forEach(function(product) {
        // Create the product card HTML
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Build the card content
        productCard.innerHTML = `
            <span class="product-icon">${product.icon || '📦'}</span>
            <h4>${product.name}</h4>
            <span class="product-category">${getCategoryNameArabic(product.category)}</span>
            <div class="product-seller">من: ${product.ownerName}</div>
            <div class="product-price">${product.price} EGP</div>
            <button 
                class="btn btn-primary btn-block" 
                onclick="addToCart(${product.id})"
            >
                أضف للسلة
            </button>
        `;
        
        // Add the card to the products list
        productsList.appendChild(productCard);
    });
}

/**
 * getCategoryNameArabic(category)
 * Returns Arabic name for category.
 * @param {string} category - The English category name
 * @returns {string} Arabic category name
 */
function getCategoryNameArabic(category) {
    const categories = {
        'Pizza': '🍕 بيتزا',
        'Burgers': '🍔 برجر',
        'Drinks': '🥤 مشروبات',
        'Desserts': '🍰 حلويات',
        'Other': '📦 أخرى'
    };
    return categories[category] || category;
}

/**
 * displayCart()
 * Shows all items currently in the shopping cart.
 */
function displayCart() {
    // Get the cart container and total display
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">السلة فارغة</p>';
        cartTotal.textContent = '0 EGP';
        return;
    }
    
    // Clear the container
    cartItems.innerHTML = '';
    
    // Calculate total price
    let total = 0;
    
    // Loop through cart items and display each one
    cart.forEach(function(item, index) {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} x${item.quantity}</div>
                <div class="cart-item-price">${item.price * item.quantity} EGP</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                حذف
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update the total
    cartTotal.textContent = total + ' EGP';
}

/**
 * displayCustomerOrders()
 * Shows all orders placed by the current customer.
 */
function displayCustomerOrders() {
    const ordersContainer = document.getElementById('customerOrders');
    
    // Filter orders for the current customer
    const customerOrders = orders.filter(function(order) {
        return order.customerId === currentUser.id;
    });
    
    // Check if there are no orders
    if (customerOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">لا توجد طلبات</p>';
        return;
    }
    
    // Clear container
    ordersContainer.innerHTML = '';
    
    // Display each order
    customerOrders.forEach(function(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Build the items list
        let itemsList = '';
        order.items.forEach(function(item) {
            itemsList += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} EGP</li>`;
        });
        
        // Get payment method text
        const paymentText = order.paymentMethod === 'cash' ? '🚚 الدفع عند الاستلام' : '💳 بطاقة ائتمان';
        
        // Get status in Arabic
        const statusArabic = getStatusArabic(order.status);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">طلب #${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <span class="order-status ${order.status}">${statusArabic}</span>
            </div>
            <div class="order-items">
                <ul>${itemsList}</ul>
            </div>
            <div class="order-total">الإجمالي: ${order.totalPrice} EGP</div>
            <div class="order-payment">${paymentText}</div>
            <div class="order-actions">
                ${order.status === 'pending' ? 
                    `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">إلغاء الطلب</button>` 
                    : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

/**
 * getStatusArabic(status)
 * Returns Arabic translation for order status.
 * @param {string} status - The English status
 * @returns {string} Arabic status
 */
function getStatusArabic(status) {
    const statuses = {
        'pending': 'قيد الانتظار',
        'preparing': 'جاري التحضير',
        'on-the-way': 'في الطريق',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغي'
    };
    return statuses[status] || status;
}

/**
 * displayPendingProducts()
 * Shows products waiting for admin approval.
 */
function displayPendingProducts() {
    const pendingList = document.getElementById('pendingProductsList');
    
    // Filter products with pending status
    const pendingProducts = products.filter(function(product) {
        return product.status === 'pending';
    });
    
    // Clear container
    pendingList.innerHTML = '';
    
    // Check if no pending products
    if (pendingProducts.length === 0) {
        pendingList.innerHTML = '<p class="no-orders">لا توجد منتجات تنتظر الموافقة ✅</p>';
        return;
    }
    
    // Display each pending product
    pendingProducts.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name}</div>
                <div class="admin-item-details">
                    ${product.price} EGP | ${getCategoryNameArabic(product.category)}
                </div>
                <div class="admin-item-seller">من: ${product.ownerName}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-success btn-sm" onclick="approveProduct(${product.id})">
                    ✅ موافقة
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectProduct(${product.id})">
                    ❌ رفض
                </button>
            </div>
        `;
        
        pendingList.appendChild(productItem);
    });
}

/**
 * displayAdminProducts()
 * Shows all products in the admin panel.
 */
function displayAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    
    // Clear container
    adminProductsList.innerHTML = '';
    
    // Display each product
    products.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        // Add 'selected' class if this product is selected
        if (product.id === selectedProductId) {
            productItem.classList.add('selected');
        }
        
        // Get status badge
        const statusBadge = product.status === 'approved' 
            ? '<span class="product-status approved">معتمد</span>'
            : '<span class="product-status pending">قيد الانتظار</span>';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name} ${statusBadge}</div>
                <div class="admin-item-details">
                    ${product.price} EGP | ${getCategoryNameArabic(product.category)}
                </div>
                <div class="admin-item-seller">من: ${product.ownerName}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="selectProduct(${product.id})">
                    تعديل
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct(${product.id})">
                    حذف
                </button>
            </div>
        `;
        
        adminProductsList.appendChild(productItem);
    });
}

/**
 * displayAllUsers()
 * Shows all users in the system (admin feature).
 */
function displayAllUsers() {
    const usersList = document.getElementById('usersList');
    
    // Clear container
    usersList.innerHTML = '';
    
    // Display each user
    users.forEach(function(user) {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        // Get the first letter of the name for the avatar
        const initial = user.name.charAt(0).toUpperCase();
        
        // Get role in Arabic
        const roleArabic = {
            'customer': 'عميل',
            'admin': 'مدير',
            'serviceOfferor': 'مقدم خدمة',
            'courier': 'مندوب توصيل'
        };
        
        userCard.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-role">${roleArabic[user.role]}</div>
            </div>
        `;
        
        usersList.appendChild(userCard);
    });
}

/**
 * displayServiceProducts()
 * Shows products owned by the current service offeror.
 */
function displayServiceProducts() {
    const serviceProductsList = document.getElementById('serviceProductsList');
    
    // Filter products owned by the current service offeror
    const ownedProducts = products.filter(function(product) {
        return product.ownerId === currentUser.id;
    });
    
    // Clear container
    serviceProductsList.innerHTML = '';
    
    if (ownedProducts.length === 0) {
        serviceProductsList.innerHTML = '<p class="no-orders">لم تقم بإضافة منتجات بعد</p>';
        return;
    }
    
    // Display each product
    ownedProducts.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        // Add 'selected' class if this product is selected
        if (product.id === selectedProductId) {
            productItem.classList.add('selected');
        }
        
        // Get status badge
        const statusBadge = product.status === 'approved' 
            ? '<span class="product-status approved">معتمد ✅</span>'
            : '<span class="product-status pending">قيد الانتظار ⏳</span>';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name} ${statusBadge}</div>
                <div class="admin-item-details">
                    ${product.price} EGP | ${getCategoryNameArabic(product.category)}
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="selectServiceProduct(${product.id})">
                    تعديل
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeServiceProduct(${product.id})">
                    حذف
                </button>
            </div>
        `;
        
        serviceProductsList.appendChild(productItem);
    });
}

/**
 * displayCourierOrders()
 * Shows orders assigned to the current courier.
 */
function displayCourierOrders() {
    const courierOrders = document.getElementById('courierOrders');
    
    // Filter orders assigned to the current courier
    const assignedOrders = orders.filter(function(order) {
        return order.assignedCourier === currentUser.id;
    });
    
    // Check if there are no assigned orders
    if (assignedOrders.length === 0) {
        courierOrders.innerHTML = '<p class="no-orders">لا توجد طلبات مسندة إليك</p>';
        return;
    }
    
    // Clear container
    courierOrders.innerHTML = '';
    
    // Display each order
    assignedOrders.forEach(function(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Build the items list
        let itemsList = '';
        order.items.forEach(function(item) {
            itemsList += `<li>${item.name} x${item.quantity}</li>`;
        });
        
        // Get payment method text
        const paymentText = order.paymentMethod === 'cash' ? '🚚 الدفع عند الاستلام' : '💳 مدفوع بالبطاقة';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">طلب #${order.id}</div>
                    <div class="order-date">العميل: ${order.customerName}</div>
                </div>
                <span class="order-status ${order.status}">${getStatusArabic(order.status)}</span>
            </div>
            <div class="order-items">
                <ul>${itemsList}</ul>
            </div>
            <div class="order-total">الإجمالي: ${order.totalPrice} EGP</div>
            <div class="order-payment">${paymentText}</div>
            <div class="order-actions">
                <label>تحديث الحالة:</label>
                <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>جاري التحضير</option>
                    <option value="on-the-way" ${order.status === 'on-the-way' ? 'selected' : ''}>في الطريق</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                </select>
            </div>
        `;
        
        courierOrders.appendChild(orderCard);
    });
}

/* ==================== SECTION 5: CUSTOMER FUNCTIONS ====================
   Functions for customer actions (cart, checkout, payment).
   ====================================================================== */

/**
 * addToCart(productId)
 * Adds a product to the shopping cart.
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
    // Find the product by ID
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    // Check if product exists
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Check if product is already in cart
    const existingItem = cart.find(function(item) {
        return item.productId === productId;
    });
    
    if (existingItem) {
        // Increase quantity if already in cart
        existingItem.quantity += 1;
        showToast(`تمت إضافة ${product.name} مرة أخرى!`, 'success');
    } else {
        // Add new item to cart
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        showToast(`تمت إضافة ${product.name} للسلة!`, 'success');
    }
    
    // Update the cart display
    displayCart();
}

/**
 * removeFromCart(index)
 * Removes an item from the shopping cart.
 * @param {number} index - The index of the item in the cart array
 */
function removeFromCart(index) {
    // Get the item name before removing
    const itemName = cart[index].name;
    
    // Remove the item from the cart array
    cart.splice(index, 1);
    
    // Show notification
    showToast(`تم حذف ${itemName} من السلة`, 'success');
    
    // Update the cart display
    displayCart();
}

/**
 * calculateCartTotal()
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price in EGP
 */
function calculateCartTotal() {
    let total = 0;
    
    // Loop through each item and add to total
    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });
    
    return total;
}

/**
 * showCheckout()
 * Opens the checkout modal.
 */
function showCheckout() {
    // Check if cart is empty
    if (cart.length === 0) {
        showToast('السلة فارغة!', 'error');
        return;
    }
    
    // Build checkout items summary
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = '';
    
    cart.forEach(function(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity} EGP</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });
    
    // Update total
    const total = calculateCartTotal();
    document.getElementById('checkoutTotal').textContent = total + ' EGP';
    
    // Show the checkout modal
    document.getElementById('checkoutModal').classList.remove('hidden');
    
    // Reset payment method to cash
    document.querySelector('input[value="cash"]').checked = true;
    togglePaymentForm();
}

/**
 * closeCheckout()
 * Closes the checkout modal.
 */
function closeCheckout() {
    document.getElementById('checkoutModal').classList.add('hidden');
}

/**
 * togglePaymentForm()
 * Shows/hides the credit card form based on payment method selection.
 */
function togglePaymentForm() {
    // Get the selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Get the credit card form
    const creditCardForm = document.getElementById('creditCardForm');
    
    // Show/hide based on selection
    if (paymentMethod === 'card') {
        creditCardForm.classList.remove('hidden');
    } else {
        creditCardForm.classList.add('hidden');
    }
}

/**
 * processPayment()
 * Processes the payment and creates the order.
 * No real validation - just simulates payment success.
 */
function processPayment() {
    // Get the selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Calculate total
    const total = calculateCartTotal();
    
    // Create the new order object
    const newOrder = {
        id: nextOrderId,
        customerId: currentUser.id,
        customerName: currentUser.name,
        items: cart.map(function(item) {
            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        }),
        totalPrice: total,
        status: 'pending',
        paymentMethod: paymentMethod,
        date: new Date().toISOString().split('T')[0],
        // Assign to a random available courier
        assignedCourier: getRandomCourier()
    };
    
    // Add the order to the orders array
    orders.push(newOrder);
    
    // Increment the order ID counter
    nextOrderId++;
    
    // Clear the cart
    cart = [];
    
    // Close checkout modal
    closeCheckout();
    
    // Show success modal with appropriate message
    showPaymentSuccess(paymentMethod);
    
    // Update displays
    displayCart();
    displayCustomerOrders();
}

/**
 * getRandomCourier()
 * Returns the ID of a random courier.
 * @returns {number} Courier ID
 */
function getRandomCourier() {
    // Find all couriers
    const couriers = users.filter(function(user) {
        return user.role === 'courier';
    });
    
    // Return a random courier ID (or first one if only one exists)
    if (couriers.length > 0) {
        const randomIndex = Math.floor(Math.random() * couriers.length);
        return couriers[randomIndex].id;
    }
    
    return null;
}

/**
 * showPaymentSuccess(paymentMethod)
 * Shows the payment success modal with appropriate message.
 * @param {string} paymentMethod - "cash" or "card"
 */
function showPaymentSuccess(paymentMethod) {
    const modal = document.getElementById('paymentSuccessModal');
    const icon = document.getElementById('paymentSuccessIcon');
    const title = document.getElementById('paymentSuccessTitle');
    const message = document.getElementById('paymentSuccessMessage');
    
    if (paymentMethod === 'card') {
        icon.textContent = '✅';
        title.textContent = 'تم الدفع بنجاح!';
        message.textContent = 'Payment successful ✅ - شكراً لك! سيتم توصيل طلبك قريباً.';
    } else {
        icon.textContent = '🚚';
        title.textContent = 'تم تأكيد الطلب!';
        message.textContent = 'You will pay on delivery 🚚 - سيتم الدفع عند الاستلام.';
    }
    
    modal.classList.remove('hidden');
}

/**
 * closePaymentSuccess()
 * Closes the payment success modal.
 */
function closePaymentSuccess() {
    document.getElementById('paymentSuccessModal').classList.add('hidden');
}

/**
 * cancelOrder(orderId)
 * Cancels an order (only works for pending orders).
 * @param {number} orderId - The ID of the order to cancel
 */
function cancelOrder(orderId) {
    // Find the order
    const order = orders.find(function(o) {
        return o.id === orderId;
    });
    
    // Check if order exists
    if (!order) {
        showToast('الطلب غير موجود!', 'error');
        return;
    }
    
    // Check if order can be cancelled
    if (order.status !== 'pending') {
        showToast('لا يمكن إلغاء هذا الطلب!', 'error');
        return;
    }
    
    // Update the status to cancelled
    order.status = 'cancelled';
    
    // Update the display
    displayCustomerOrders();
    
    // Show success message
    showToast('تم إلغاء الطلب', 'success');
}

/* ==================== SECTION 6: ADMIN FUNCTIONS ====================
   Functions for admin actions (product approval, management).
   =================================================================== */

/**
 * approveProduct(productId)
 * Approves a pending product so it appears to customers.
 * @param {number} productId - The ID of the product to approve
 */
function approveProduct(productId) {
    // Find the product
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Update status to approved
    product.status = 'approved';
    
    // Update displays
    displayPendingProducts();
    displayAdminProducts();
    
    showToast(`تمت الموافقة على ${product.name}! ✅`, 'success');
}

/**
 * rejectProduct(productId)
 * Rejects and removes a pending product.
 * @param {number} productId - The ID of the product to reject
 */
function rejectProduct(productId) {
    // Find the product index
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Get product name for message
    const productName = products[productIndex].name;
    
    // Remove the product
    products.splice(productIndex, 1);
    
    // Update displays
    displayPendingProducts();
    displayAdminProducts();
    
    showToast(`تم رفض ${productName}`, 'success');
}

/**
 * addProduct(event)
 * Admin adds a new product (automatically approved).
 * @param {Event} event - The form submit event
 */
function addProduct(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the form values
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    
    // Validate inputs
    if (!name || !price || !category) {
        showToast('الرجاء ملء جميع الحقول!', 'error');
        return;
    }
    
    // Get an icon based on category
    const icons = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Other': '📦'
    };
    
    // Create the new product object (admin products are auto-approved)
    const newProduct = {
        id: nextProductId,
        name: name,
        price: price,
        category: category,
        status: 'approved',  // Admin products are automatically approved
        ownerId: null,
        ownerName: 'QuickDeliver',
        icon: icons[category] || '📦'
    };
    
    // Add to the products array
    products.push(newProduct);
    
    // Increment the product ID counter
    nextProductId++;
    
    // Clear the form
    document.getElementById('productForm').reset();
    
    // Update the display
    displayAdminProducts();
    
    // Show success message
    showToast('تمت إضافة المنتج بنجاح!', 'success');
}

/**
 * selectProduct(productId)
 * Selects a product for editing and fills the form.
 * @param {number} productId - The ID of the product to select
 */
function selectProduct(productId) {
    // Find the product
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Set the selected product
    selectedProductId = productId;
    
    // Fill the form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    
    // Update display to show selection
    displayAdminProducts();
    
    showToast('تم تحديد المنتج للتعديل', 'success');
}

/**
 * updateProduct()
 * Updates the currently selected product with form values.
 */
function updateProduct() {
    // Check if a product is selected
    if (selectedProductId === null) {
        showToast('الرجاء تحديد منتج للتعديل!', 'error');
        return;
    }
    
    // Find the product
    const product = products.find(function(p) {
        return p.id === selectedProductId;
    });
    
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Get form values
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    
    // Validate inputs
    if (!name || !price || !category) {
        showToast('الرجاء ملء جميع الحقول!', 'error');
        return;
    }
    
    // Update the product
    product.name = name;
    product.price = price;
    product.category = category;
    
    // Clear selection
    selectedProductId = null;
    
    // Clear the form
    document.getElementById('productForm').reset();
    
    // Update display
    displayAdminProducts();
    
    showToast('تم تحديث المنتج بنجاح!', 'success');
}

/**
 * removeProduct(productId)
 * Removes a product from the system.
 * @param {number} productId - The ID of the product to remove
 */
function removeProduct(productId) {
    // Find the product index
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Get the product name for the message
    const productName = products[productIndex].name;
    
    // Remove the product from the array
    products.splice(productIndex, 1);
    
    // Clear selection if this product was selected
    if (selectedProductId === productId) {
        selectedProductId = null;
        document.getElementById('productForm').reset();
    }
    
    // Update display
    displayPendingProducts();
    displayAdminProducts();
    
    showToast(`تم حذف ${productName}!`, 'success');
}

/**
 * scrollToUsers()
 * Scrolls to the users list section (admin feature).
 */
function scrollToUsers() {
    const usersContainer = document.getElementById('usersListContainer');
    usersContainer.scrollIntoView({ behavior: 'smooth' });
}

/* ==================== SECTION 7: SERVICE OFFEROR FUNCTIONS ====================
   Functions for service offeror actions.
   ============================================================================= */

/**
 * addServiceProduct(event)
 * Service offeror adds a new product (starts as PENDING).
 * @param {Event} event - The form submit event
 */
function addServiceProduct(event) {
    // Prevent form from submitting normally
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('serviceProductName').value;
    const price = parseFloat(document.getElementById('serviceProductPrice').value);
    const category = document.getElementById('serviceProductCategory').value;
    
    // Validate inputs
    if (!name || !price || !category) {
        showToast('الرجاء ملء جميع الحقول!', 'error');
        return;
    }
    
    // Get an icon based on category
    const icons = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Other': '📦'
    };
    
    // Create the new product object (PENDING - needs admin approval)
    const newProduct = {
        id: nextProductId,
        name: name,
        price: price,
        category: category,
        status: 'pending',  // Starts as pending - needs admin approval
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        icon: icons[category] || '📦'
    };
    
    // Add to products array
    products.push(newProduct);
    
    // Increment counter
    nextProductId++;
    
    // Clear form
    document.getElementById('serviceProductForm').reset();
    
    // Update display
    displayServiceProducts();
    
    showToast('تمت إضافة المنتج! سيظهر للعملاء بعد موافقة المدير ⏳', 'success');
}

/**
 * selectServiceProduct(productId)
 * Selects a product for editing (service offeror version).
 * @param {number} productId - The ID of the product to select
 */
function selectServiceProduct(productId) {
    // Find the product
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Set selected product
    selectedProductId = productId;
    
    // Fill form
    document.getElementById('serviceProductName').value = product.name;
    document.getElementById('serviceProductPrice').value = product.price;
    document.getElementById('serviceProductCategory').value = product.category;
    
    // Update display
    displayServiceProducts();
    
    showToast('تم تحديد المنتج للتعديل', 'success');
}

/**
 * updateServiceProduct()
 * Updates the selected product (service offeror version).
 */
function updateServiceProduct() {
    // Check if a product is selected
    if (selectedProductId === null) {
        showToast('الرجاء تحديد منتج للتعديل!', 'error');
        return;
    }
    
    // Find the product
    const product = products.find(function(p) {
        return p.id === selectedProductId;
    });
    
    if (!product) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Get form values
    const name = document.getElementById('serviceProductName').value;
    const price = parseFloat(document.getElementById('serviceProductPrice').value);
    const category = document.getElementById('serviceProductCategory').value;
    
    // Validate
    if (!name || !price || !category) {
        showToast('الرجاء ملء جميع الحقول!', 'error');
        return;
    }
    
    // Update product
    product.name = name;
    product.price = price;
    product.category = category;
    
    // Clear selection
    selectedProductId = null;
    
    // Clear form
    document.getElementById('serviceProductForm').reset();
    
    // Update display
    displayServiceProducts();
    
    showToast('تم تحديث المنتج بنجاح!', 'success');
}

/**
 * removeServiceProduct(productId)
 * Removes a product owned by the service offeror.
 * @param {number} productId - The ID of the product to remove
 */
function removeServiceProduct(productId) {
    // Find product index
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('المنتج غير موجود!', 'error');
        return;
    }
    
    // Get name for message
    const productName = products[productIndex].name;
    
    // Remove from array
    products.splice(productIndex, 1);
    
    // Clear selection if needed
    if (selectedProductId === productId) {
        selectedProductId = null;
        document.getElementById('serviceProductForm').reset();
    }
    
    // Update display
    displayServiceProducts();
    
    showToast(`تم حذف ${productName}!`, 'success');
}

/* ==================== SECTION 8: COURIER FUNCTIONS ====================
   Functions for courier actions.
   ===================================================================== */

/**
 * updateDeliveryArea()
 * Updates the courier's delivery area.
 */
function updateDeliveryArea() {
    // Get the input value
    const newArea = document.getElementById('deliveryArea').value;
    
    // Validate
    if (!newArea.trim()) {
        showToast('الرجاء إدخال منطقة التوصيل!', 'error');
        return;
    }
    
    // Update the current user's delivery area
    currentUser.deliveryArea = newArea;
    
    // Also update in the users array
    const userInArray = users.find(function(u) {
        return u.id === currentUser.id;
    });
    if (userInArray) {
        userInArray.deliveryArea = newArea;
    }
    
    // Update the display
    document.getElementById('currentArea').textContent = newArea;
    document.getElementById('deliveryArea').value = '';
    
    showToast('تم تحديث منطقة التوصيل!', 'success');
}

/**
 * updateOrderStatus(orderId, newStatus)
 * Updates the status of an order (courier action).
 * @param {number} orderId - The ID of the order to update
 * @param {string} newStatus - The new status value
 */
function updateOrderStatus(orderId, newStatus) {
    // Find the order
    const order = orders.find(function(o) {
        return o.id === orderId;
    });
    
    if (!order) {
        showToast('الطلب غير موجود!', 'error');
        return;
    }
    
    // Update the status
    order.status = newStatus;
    
    // Show success message
    showToast(`تم تحديث حالة الطلب #${orderId} إلى: ${getStatusArabic(newStatus)}`, 'success');
    
    // Update display (no need to re-render, just show message)
}

/* ==================== SECTION 9: UTILITY FUNCTIONS ====================
   Helper functions used throughout the application.
   ===================================================================== */

/**
 * showToast(message, type)
 * Shows a notification message to the user.
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showToast(message, type) {
    // Get the toast element
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set the message
    toastMessage.textContent = message;
    
    // Remove any existing type classes
    toast.classList.remove('success', 'error');
    
    // Add the new type class
    toast.classList.add(type);
    
    // Show the toast
    toast.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(function() {
        toast.classList.add('hidden');
    }, 3000);
}

/* ==================== INITIALIZATION ====================
   Code that runs when the page first loads.
   ======================================================= */

// Wait for the page to fully load, then initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('QuickDeliver app loaded! 🚀');
    console.log('مرحباً بك في نظام التوصيل السريع');
    
    // Log the initial data for debugging
    console.log('Users:', users);
    console.log('Products:', products);
    console.log('Orders:', orders);
    
    // The app starts on the login page
    // User must login or signup to access the main app
});

/* ==================== END OF SCRIPT ====================
   This is the end of the script.js file.
   All functionality for the QuickDeliver system is above.
   
   SUMMARY OF FEATURES:
   - Login / Signup with role selection
   - Egyptian names and EGP currency
   - Customer: browse products, add to cart, checkout with payment
   - Payment: Pay on Delivery or Credit Card (simulated)
   - Admin: approve/reject products, manage all products, view users
   - Service Offeror: add products (pending approval), manage own products
   - Courier: view assigned orders, update status, update delivery area
   ======================================================= */
