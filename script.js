
let currentUser = null;

// ===== USERS ARRAY =====
// Contains all user accounts in the system
// Egyptian names used for all demo users
let users = [
    // ADMIN ACCOUNT - Has full control over the system
    {
        id: 1,
        name: "Mohamed Salah",      // Admin user (Egyptian name)
        email: "admin@email.com",
        password: "admin123",
        role: "admin"
    },
    
    // CUSTOMER ACCOUNTS - Can browse and order products
    {
        id: 2,
        name: "Ahmed Hassan",       // Customer (Egyptian name)
        email: "ahmed@email.com",
        password: "123456",
        role: "customer",
        cart: [],
        orders: []
    },
    {
        id: 3,
        name: "Fatma Ali",          // Customer (Egyptian name)
        email: "fatma@email.com",
        password: "123456",
        role: "customer",
        cart: [],
        orders: []
    },
    {
        id: 4,
        name: "Salma Mostafa",      // Customer (Egyptian name)
        email: "salma@email.com",
        password: "123456",
        role: "customer",
        cart: [],
        orders: []
    },
    
    // SERVICE OFFEROR ACCOUNTS - Can add products (need admin approval)
    {
        id: 5,
        name: "Pizza King Restaurant",  // Service Offeror (Egyptian business)
        email: "pizza@email.com",
        password: "pizza123",
        role: "serviceOfferor",
        ownedProducts: [1, 2, 3]
    },
    {
        id: 6,
        name: "Burger House Egypt",     // Service Offeror
        email: "burger@email.com",
        password: "burger123",
        role: "serviceOfferor",
        ownedProducts: [4, 5]
    },
    
    // COURIER ACCOUNTS - Deliver orders
    {
        id: 7,
        name: "Nour El-Din",        // Courier (Egyptian name)
        email: "nour@email.com",
        password: "nour123",
        role: "courier",
        deliveryArea: "Downtown Cairo",
        assignedOrders: []
    },
    {
        id: 8,
        name: "Karim Mahmoud",      // Courier (Egyptian name)
        email: "karim@email.com",
        password: "karim123",
        role: "courier",
        deliveryArea: "Maadi",
        assignedOrders: []
    }
];

// ===== PRODUCTS ARRAY =====
// All products in the system
// Prices are in EGP (Egyptian Pounds)
// Status: "approved" = visible to customers, "pending" = needs admin approval
let products = [
    // PIZZA CATEGORY (Approved - visible to customers)
    {
        id: 1,
        name: "Margherita Pizza",
        price: 90,                  // 90 EGP
        category: "Pizza",
        status: "approved",         // Visible to customers
        ownerId: 5,
        ownerName: "Pizza King Restaurant",
        icon: "🍕"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        price: 120,                 // 120 EGP
        category: "Pizza",
        status: "approved",
        ownerId: 5,
        ownerName: "Pizza King Restaurant",
        icon: "🍕"
    },
    {
        id: 3,
        name: "Vegetable Pizza",
        price: 85,                  // 85 EGP
        category: "Pizza",
        status: "approved",
        ownerId: 5,
        ownerName: "Pizza King Restaurant",
        icon: "🍕"
    },
    
    // BURGERS CATEGORY (Approved)
    {
        id: 4,
        name: "Classic Beef Burger",
        price: 75,                  // 75 EGP
        category: "Burgers",
        status: "approved",
        ownerId: 6,
        ownerName: "Burger House Egypt",
        icon: "🍔"
    },
    {
        id: 5,
        name: "Crispy Chicken Burger",
        price: 65,                  // 65 EGP
        category: "Burgers",
        status: "approved",
        ownerId: 6,
        ownerName: "Burger House Egypt",
        icon: "🍔"
    },
    
    // DRINKS CATEGORY (Approved)
    {
        id: 6,
        name: "Fresh Orange Juice",
        price: 25,                  // 25 EGP
        category: "Drinks",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍊"
    },
    {
        id: 7,
        name: "Coca Cola",
        price: 15,                  // 15 EGP
        category: "Drinks",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🥤"
    },
    
    // DESSERTS CATEGORY (Approved)
    {
        id: 8,
        name: "Kunafa Nabulsia",    // Egyptian/Middle Eastern dessert
        price: 45,                  // 45 EGP
        category: "Desserts",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍰"
    },
    {
        id: 9,
        name: "Om Ali",             // Traditional Egyptian dessert
        price: 35,                  // 35 EGP
        category: "Desserts",
        status: "approved",
        ownerId: null,
        ownerName: "QuickDeliver",
        icon: "🍮"
    },
    
    // PENDING PRODUCT (Needs admin approval - NOT visible to customers)
    {
        id: 10,
        name: "Seafood Pizza Special",
        price: 150,                 // 150 EGP
        category: "Pizza",
        status: "pending",          // Waiting for admin approval
        ownerId: 5,
        ownerName: "Pizza King Restaurant",
        icon: "🍕"
    }
];

// ===== ORDERS ARRAY =====
// Sample order for testing
let orders = [
    {
        id: 1001,
        customerId: 2,
        customerName: "Ahmed Hassan",
        items: [
            { name: "Margherita Pizza", price: 90, quantity: 1 },
            { name: "Coca Cola", price: 15, quantity: 2 }
        ],
        totalPrice: 120,            // Total in EGP
        status: "preparing",
        paymentMethod: "cash",
        date: "2025-12-25",
        assignedCourier: 7
    }
];

// ===== SHOPPING CART =====
// Temporary cart for current customer session
let cart = [];

// ===== STATE VARIABLES =====
let selectedProductId = null;       // For editing products
let currentCategoryFilter = "all";  // Category filter for products

// ===== ID COUNTERS =====
// Used to generate unique IDs for new records
let nextProductId = 11;
let nextOrderId = 1002;
let nextUserId = 9;


/* ==================== SECTION 2: AUTHENTICATION ====================
   Login and Signup functions.
   
   IMPORTANT RULES:
   - Signup creates CUSTOMER accounts ONLY (no role selection)
   - Login checks stored users and redirects based on role
   - Admin creates other role accounts from Admin Dashboard
   ================================================================== */

/**
 * showAuthTab(tab)
 * Switches between Login and Signup forms on the auth page.
 * @param {string} tab - "login" or "signup"
 */
function showAuthTab(tab) {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    // Remove active class from all tabs
    tabs.forEach(function(t) {
        t.classList.remove('active');
    });
    
    // Show correct form based on tab parameter
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
 * Processes login form submission.
 * Checks email/password against users array.
 * Redirects to appropriate page based on user's role.
 * @param {Event} event - Form submit event
 */
function handleLogin(event) {
    // Prevent form from refreshing page
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user by email in users array
    const user = users.find(function(u) {
        return u.email === email;
    });
    
    // Check if user exists
    if (!user) {
        showToast('Email not registered!', 'error');
        return;
    }
    
    // Check password
    if (user.password !== password) {
        showToast('Incorrect password!', 'error');
        return;
    }
    
    // Login successful - store current user
    currentUser = user;
    
    showToast('Login successful! 🎉', 'success');
    
    // Redirect to role-specific page
    redirectToRolePage();
}

/**
 * handleSignup(event)
 * Processes signup form submission.
 * IMPORTANT: Always creates CUSTOMER account (no role selection).
 * Admin is the only one who can create other roles.
 * @param {Event} event - Form submit event
 */
function handleSignup(event) {
    // Prevent form from refreshing page
    event.preventDefault();
    
    // Get form values (NO ROLE - customers only)
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Check if email already exists
    const existingUser = users.find(function(u) {
        return u.email === email;
    });
    
    if (existingUser) {
        showToast('Email already registered!', 'error');
        return;
    }
    
    // Create new CUSTOMER account
    // NOTE: Role is hardcoded as "customer" - users cannot choose other roles
    const newUser = {
        id: nextUserId,
        name: name,
        email: email,
        password: password,
        role: "customer",   // ALWAYS customer - Admin creates other roles
        cart: [],
        orders: []
    };
    
    // Add to users array
    users.push(newUser);
    nextUserId++;
    
    // Auto-login the new user
    currentUser = newUser;
    
    showToast('Account created successfully! Welcome! 🎉', 'success');
    
    // Redirect to customer page
    redirectToRolePage();
}

/**
 * redirectToRolePage()
 * Shows the main app and displays the correct section based on user role.
 * Called after successful login or signup.
 */
function redirectToRolePage() {
    // Hide login page, show main app
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update header with user info
    document.getElementById('welcomeUser').textContent = 'Welcome, ' + currentUser.name;
    
    // Update role badge
    const roleBadge = document.getElementById('userRoleBadge');
    const roleNames = {
        'customer': 'Customer',
        'admin': 'Admin',
        'serviceOfferor': 'Service Offeror',
        'courier': 'Courier'
    };
    roleBadge.textContent = roleNames[currentUser.role];
    
    // Show/hide admin footer link
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
    
    // Show section based on user's role
    // This is where the role-based redirect happens
    if (currentUser.role === 'customer') {
        // CUSTOMER: Show products, cart, orders
        document.getElementById('customerSection').classList.remove('hidden');
        displayProducts();
        displayCart();
        displayCustomerOrders();
        
    } else if (currentUser.role === 'admin') {
        // ADMIN: Show dashboard with full control
        document.getElementById('adminSection').classList.remove('hidden');
        displayPendingProducts();
        displayAdminProducts();
        displayUsersTable();  // Show users table with Edit buttons
        
    } else if (currentUser.role === 'serviceOfferor') {
        // SERVICE OFFEROR: Show product management
        document.getElementById('serviceOfferorSection').classList.remove('hidden');
        displayServiceProducts();
        
    } else if (currentUser.role === 'courier') {
        // COURIER: Show assigned orders
        document.getElementById('courierSection').classList.remove('hidden');
        // Set current delivery area from user data
        if (currentUser.deliveryArea) {
            document.getElementById('currentArea').textContent = currentUser.deliveryArea;
        }
        displayCourierOrders();
    }
}

/**
 * logout()
 * Logs out current user and returns to login page.
 */
function logout() {
    currentUser = null;
    cart = [];
    selectedProductId = null;
    
    // Hide main app, show login page
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    
    // Clear login form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    showAuthTab('login');
    showToast('Logged out successfully', 'success');
}


/* ==================== SECTION 3: ADMIN FUNCTIONS ====================
   Admin has FULL CONTROL over the system:
   - Create accounts for Admin, Courier, Service Offeror
   - Edit any user account (name, email, role, password)
   - Approve/Reject products from Service Offerors
   - Add/Update/Delete products
   =================================================================== */

/**
 * createAccount(event)
 * Admin creates a new account (Admin, Courier, or Service Offeror).
 * NOTE: Customers sign up themselves - Admin doesn't create customer accounts.
 * @param {Event} event - Form submit event
 */
function createAccount(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    
    // Validate role is selected
    if (!role) {
        showToast('Please select a role!', 'error');
        return;
    }
    
    // Check if email already exists
    const existingUser = users.find(function(u) {
        return u.email === email;
    });
    
    if (existingUser) {
        showToast('Email already registered!', 'error');
        return;
    }
    
    // Create new user object based on role
    const newUser = {
        id: nextUserId,
        name: name,
        email: email,
        password: password,
        role: role
    };
    
    // Add role-specific properties
    if (role === 'serviceOfferor') {
        newUser.ownedProducts = [];
    } else if (role === 'courier') {
        newUser.deliveryArea = 'Not Set';
        newUser.assignedOrders = [];
    }
    
    // Add to users array
    users.push(newUser);
    nextUserId++;
    
    // Clear form
    document.getElementById('createAccountForm').reset();
    
    // Refresh users table
    displayUsersTable();
    
    showToast('Account created successfully for ' + name + '!', 'success');
}

/**
 * displayUsersTable()
 * Shows all users in a table format with Edit button.
 * Admin can see Name, Email, Role and edit each user.
 */
function displayUsersTable() {
    const usersTable = document.getElementById('usersTable');
    
    // Build HTML table
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add row for each user
    users.forEach(function(user) {
        html += `
            <tr>
                <td class="user-name">${user.name}</td>
                <td>${user.email}</td>
                <td><span class="user-role ${user.role}">${formatRoleName(user.role)}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">
                        ✏️ Edit
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    usersTable.innerHTML = html;
}

/**
 * formatRoleName(role)
 * Converts role ID to display name.
 * @param {string} role - Role identifier
 * @returns {string} Formatted role name
 */
function formatRoleName(role) {
    const names = {
        'customer': 'Customer',
        'admin': 'Admin',
        'serviceOfferor': 'Service Offeror',
        'courier': 'Courier'
    };
    return names[role] || role;
}

/**
 * editUser(userId)
 * Opens simple prompt dialogs to edit user data.
 * Admin can edit: Name, Email, Role, Password
 * Uses prompt() for simplicity (no modal libraries).
 * @param {number} userId - ID of user to edit
 */
function editUser(userId) {
    // Find user in array
    const user = users.find(function(u) {
        return u.id === userId;
    });
    
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }
    
    // Show edit options using prompt()
    // This is a simple approach without modal libraries
    
    const editChoice = prompt(
        'Edit User: ' + user.name + '\n\n' +
        'What do you want to edit?\n' +
        '1 - Name\n' +
        '2 - Email\n' +
        '3 - Role\n' +
        '4 - Reset Password\n' +
        '0 - Cancel\n\n' +
        'Enter number (1-4):'
    );
    
    if (!editChoice || editChoice === '0') {
        return; // User cancelled
    }
    
    switch (editChoice) {
        case '1':
            // Edit Name
            const newName = prompt('Enter new name:', user.name);
            if (newName && newName.trim() !== '') {
                user.name = newName.trim();
                showToast('Name updated successfully!', 'success');
            }
            break;
            
        case '2':
            // Edit Email
            const newEmail = prompt('Enter new email:', user.email);
            if (newEmail && newEmail.trim() !== '') {
                // Check if email is already taken by another user
                const emailTaken = users.find(function(u) {
                    return u.email === newEmail && u.id !== userId;
                });
                if (emailTaken) {
                    showToast('Email already in use!', 'error');
                } else {
                    user.email = newEmail.trim();
                    showToast('Email updated successfully!', 'success');
                }
            }
            break;
            
        case '3':
            // Edit Role
            const roleChoice = prompt(
                'Current role: ' + formatRoleName(user.role) + '\n\n' +
                'Select new role:\n' +
                '1 - Customer\n' +
                '2 - Admin\n' +
                '3 - Service Offeror\n' +
                '4 - Courier\n\n' +
                'Enter number (1-4):'
            );
            
            const roleMap = {
                '1': 'customer',
                '2': 'admin',
                '3': 'serviceOfferor',
                '4': 'courier'
            };
            
            if (roleMap[roleChoice]) {
                user.role = roleMap[roleChoice];
                
                // Add role-specific properties if needed
                if (user.role === 'customer' && !user.cart) {
                    user.cart = [];
                    user.orders = [];
                } else if (user.role === 'serviceOfferor' && !user.ownedProducts) {
                    user.ownedProducts = [];
                } else if (user.role === 'courier' && !user.deliveryArea) {
                    user.deliveryArea = 'Not Set';
                    user.assignedOrders = [];
                }
                
                showToast('Role updated to ' + formatRoleName(user.role) + '!', 'success');
            }
            break;
            
        case '4':
            // Reset Password
            const newPassword = prompt('Enter new password:');
            if (newPassword && newPassword.trim() !== '') {
                user.password = newPassword;
                showToast('Password reset successfully!', 'success');
            }
            break;
            
        default:
            showToast('Invalid option', 'error');
    }
    
    // Refresh users table to show changes
    displayUsersTable();
}

/**
 * scrollToUsers()
 * Scrolls to the Users Accounts section.
 * Called when admin clicks footer link.
 */
function scrollToUsers() {
    const usersContainer = document.getElementById('usersListContainer');
    usersContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * approveProduct(productId)
 * Admin approves a pending product so customers can see it.
 * @param {number} productId - ID of product to approve
 */
function approveProduct(productId) {
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    // Change status from "pending" to "approved"
    product.status = 'approved';
    
    // Refresh displays
    displayPendingProducts();
    displayAdminProducts();
    
    showToast('Product approved! ✅ ' + product.name, 'success');
}

/**
 * rejectProduct(productId)
 * Admin rejects and removes a pending product.
 * @param {number} productId - ID of product to reject
 */
function rejectProduct(productId) {
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const productName = products[productIndex].name;
    
    // Remove product from array
    products.splice(productIndex, 1);
    
    // Refresh displays
    displayPendingProducts();
    displayAdminProducts();
    
    showToast('Product rejected: ' + productName, 'success');
}

/**
 * addProduct(event)
 * Admin adds a new product (automatically approved).
 * @param {Event} event - Form submit event
 */
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    
    if (!name || !price || !category) {
        showToast('Please fill all fields!', 'error');
        return;
    }
    
    // Get icon based on category
    const icons = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Other': '📦'
    };
    
    // Admin products are automatically approved
    const newProduct = {
        id: nextProductId,
        name: name,
        price: price,
        category: category,
        status: 'approved',     // Admin products auto-approved
        ownerId: null,
        ownerName: 'QuickDeliver',
        icon: icons[category] || '📦'
    };
    
    products.push(newProduct);
    nextProductId++;
    
    document.getElementById('productForm').reset();
    displayAdminProducts();
    
    showToast('Product added successfully!', 'success');
}

/**
 * selectProduct(productId)
 * Selects a product for editing and fills the form.
 * @param {number} productId - ID of product to select
 */
function selectProduct(productId) {
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    selectedProductId = productId;
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    
    displayAdminProducts();
    showToast('Product selected for editing', 'success');
}

/**
 * updateProduct()
 * Updates the selected product with form values.
 */
function updateProduct() {
    if (selectedProductId === null) {
        showToast('Please select a product to update!', 'error');
        return;
    }
    
    const product = products.find(function(p) {
        return p.id === selectedProductId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    
    if (!name || !price || !category) {
        showToast('Please fill all fields!', 'error');
        return;
    }
    
    product.name = name;
    product.price = price;
    product.category = category;
    
    selectedProductId = null;
    document.getElementById('productForm').reset();
    displayAdminProducts();
    
    showToast('Product updated successfully!', 'success');
}

/**
 * removeProduct(productId)
 * Removes a product from the system.
 * @param {number} productId - ID of product to remove
 */
function removeProduct(productId) {
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const productName = products[productIndex].name;
    products.splice(productIndex, 1);
    
    if (selectedProductId === productId) {
        selectedProductId = null;
        document.getElementById('productForm').reset();
    }
    
    displayPendingProducts();
    displayAdminProducts();
    
    showToast('Product removed: ' + productName, 'success');
}


/* ==================== SECTION 4: CUSTOMER FUNCTIONS ====================
   Customer can:
   - View APPROVED products only
   - Add products to cart
   - Checkout with payment simulation
   - View order history
   ====================================================================== */

/**
 * filterByCategory(category)
 * Filters products display by category.
 * @param {string} category - Category to filter, or "all"
 */
function filterByCategory(category) {
    currentCategoryFilter = category;
    
    // Update active button
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
        if ((category === 'all' && btn.textContent.includes('All')) ||
            btn.textContent.includes(category)) {
            btn.classList.add('active');
        }
    });
    
    displayProducts();
}

/**
 * addToCart(productId)
 * Adds a product to the shopping cart.
 * @param {number} productId - ID of product to add
 */
function addToCart(productId) {
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    // Check if already in cart
    const existingItem = cart.find(function(item) {
        return item.productId === productId;
    });
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Added another ' + product.name + '!', 'success');
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        showToast(product.name + ' added to cart!', 'success');
    }
    
    displayCart();
}

/**
 * removeFromCart(index)
 * Removes an item from the cart.
 * @param {number} index - Index of item in cart array
 */
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    displayCart();
    showToast(itemName + ' removed from cart', 'success');
}

/**
 * calculateCartTotal()
 * Calculates total price of all cart items in EGP.
 * @returns {number} Total price
 */
function calculateCartTotal() {
    let total = 0;
    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });
    return total;
}

/**
 * showCheckout()
 * Opens the checkout modal with order summary.
 */
function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
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
    
    // Show modal
    document.getElementById('checkoutModal').classList.remove('hidden');
    
    // Reset to cash payment
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
 * Shows/hides credit card form based on payment selection.
 */
function togglePaymentForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const creditCardForm = document.getElementById('creditCardForm');
    
    if (paymentMethod === 'card') {
        creditCardForm.classList.remove('hidden');
    } else {
        creditCardForm.classList.add('hidden');
    }
}

/**
 * processPayment()
 * Processes the payment and creates the order.
 * Simulates payment - no real validation.
 */
function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const total = calculateCartTotal();
    
    // Create order object
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
        assignedCourier: getRandomCourier()
    };
    
    orders.push(newOrder);
    nextOrderId++;
    
    // Clear cart
    cart = [];
    
    closeCheckout();
    showPaymentSuccess(paymentMethod);
    
    displayCart();
    displayCustomerOrders();
}

/**
 * getRandomCourier()
 * Returns ID of a random courier.
 * @returns {number|null} Courier ID or null
 */
function getRandomCourier() {
    const couriers = users.filter(function(user) {
        return user.role === 'courier';
    });
    
    if (couriers.length > 0) {
        const randomIndex = Math.floor(Math.random() * couriers.length);
        return couriers[randomIndex].id;
    }
    return null;
}

/**
 * showPaymentSuccess(paymentMethod)
 * Shows success modal with appropriate message.
 * @param {string} paymentMethod - "cash" or "card"
 */
function showPaymentSuccess(paymentMethod) {
    const modal = document.getElementById('paymentSuccessModal');
    const icon = document.getElementById('paymentSuccessIcon');
    const title = document.getElementById('paymentSuccessTitle');
    const message = document.getElementById('paymentSuccessMessage');
    
    if (paymentMethod === 'card') {
        icon.textContent = '✅';
        title.textContent = 'Payment Successful!';
        message.textContent = 'Payment successful ✅ Thank you! Your order will be delivered soon.';
    } else {
        icon.textContent = '🚚';
        title.textContent = 'Order Confirmed!';
        message.textContent = 'You will pay on delivery 🚚 Thank you for your order!';
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
 * Cancels a pending order.
 * @param {number} orderId - ID of order to cancel
 */
function cancelOrder(orderId) {
    const order = orders.find(function(o) {
        return o.id === orderId;
    });
    
    if (!order) {
        showToast('Order not found!', 'error');
        return;
    }
    
    if (order.status !== 'pending') {
        showToast('Only pending orders can be cancelled!', 'error');
        return;
    }
    
    order.status = 'cancelled';
    displayCustomerOrders();
    showToast('Order cancelled', 'success');
}


/* ==================== SECTION 5: SERVICE OFFEROR FUNCTIONS ====================
   Service Offeror can:
   - Add products (status = "pending" until admin approves)
   - Update their own products
   - Remove their own products
   ============================================================================= */

/**
 * addServiceProduct(event)
 * Service Offeror adds a new product.
 * Product status starts as "pending" - needs admin approval.
 * @param {Event} event - Form submit event
 */
function addServiceProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('serviceProductName').value;
    const price = parseFloat(document.getElementById('serviceProductPrice').value);
    const category = document.getElementById('serviceProductCategory').value;
    
    if (!name || !price || !category) {
        showToast('Please fill all fields!', 'error');
        return;
    }
    
    const icons = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Other': '📦'
    };
    
    // Service Offeror products start as PENDING
    const newProduct = {
        id: nextProductId,
        name: name,
        price: price,
        category: category,
        status: 'pending',      // Needs admin approval
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        icon: icons[category] || '📦'
    };
    
    products.push(newProduct);
    nextProductId++;
    
    document.getElementById('serviceProductForm').reset();
    displayServiceProducts();
    
    showToast('Product added! Waiting for admin approval ⏳', 'success');
}

/**
 * selectServiceProduct(productId)
 * Selects a product for editing (Service Offeror version).
 * @param {number} productId - ID of product to select
 */
function selectServiceProduct(productId) {
    const product = products.find(function(p) {
        return p.id === productId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    selectedProductId = productId;
    
    document.getElementById('serviceProductName').value = product.name;
    document.getElementById('serviceProductPrice').value = product.price;
    document.getElementById('serviceProductCategory').value = product.category;
    
    displayServiceProducts();
    showToast('Product selected for editing', 'success');
}

/**
 * updateServiceProduct()
 * Updates the selected product (Service Offeror version).
 */
function updateServiceProduct() {
    if (selectedProductId === null) {
        showToast('Please select a product to update!', 'error');
        return;
    }
    
    const product = products.find(function(p) {
        return p.id === selectedProductId;
    });
    
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const name = document.getElementById('serviceProductName').value;
    const price = parseFloat(document.getElementById('serviceProductPrice').value);
    const category = document.getElementById('serviceProductCategory').value;
    
    if (!name || !price || !category) {
        showToast('Please fill all fields!', 'error');
        return;
    }
    
    product.name = name;
    product.price = price;
    product.category = category;
    
    selectedProductId = null;
    document.getElementById('serviceProductForm').reset();
    displayServiceProducts();
    
    showToast('Product updated successfully!', 'success');
}

/**
 * removeServiceProduct(productId)
 * Removes a product (Service Offeror version).
 * @param {number} productId - ID of product to remove
 */
function removeServiceProduct(productId) {
    const productIndex = products.findIndex(function(p) {
        return p.id === productId;
    });
    
    if (productIndex === -1) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const productName = products[productIndex].name;
    products.splice(productIndex, 1);
    
    if (selectedProductId === productId) {
        selectedProductId = null;
        document.getElementById('serviceProductForm').reset();
    }
    
    displayServiceProducts();
    showToast('Product removed: ' + productName, 'success');
}


/* ==================== SECTION 6: COURIER FUNCTIONS ====================
   Courier can:
   - View assigned orders
   - Update order status (pending → preparing → on-the-way → delivered)
   - Update delivery area
   ===================================================================== */

/**
 * updateDeliveryArea()
 * Updates the courier's delivery area.
 */
function updateDeliveryArea() {
    const newArea = document.getElementById('deliveryArea').value;
    
    if (!newArea.trim()) {
        showToast('Please enter a delivery area!', 'error');
        return;
    }
    
    currentUser.deliveryArea = newArea;
    
    // Update in users array too
    const userInArray = users.find(function(u) {
        return u.id === currentUser.id;
    });
    if (userInArray) {
        userInArray.deliveryArea = newArea;
    }
    
    document.getElementById('currentArea').textContent = newArea;
    document.getElementById('deliveryArea').value = '';
    
    showToast('Delivery area updated!', 'success');
}

/**
 * updateOrderStatus(orderId, newStatus)
 * Updates an order's status.
 * @param {number} orderId - ID of order
 * @param {string} newStatus - New status value
 */
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(function(o) {
        return o.id === orderId;
    });
    
    if (!order) {
        showToast('Order not found!', 'error');
        return;
    }
    
    order.status = newStatus;
    
    const statusNames = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'on-the-way': 'On the Way',
        'delivered': 'Delivered'
    };
    
    showToast('Order #' + orderId + ' status: ' + statusNames[newStatus], 'success');
}


/* ==================== SECTION 7: DISPLAY FUNCTIONS ====================
   Functions that render data to the screen.
   ===================================================================== */

/**
 * displayProducts()
 * Shows APPROVED products to customers.
 * Products with status="pending" are NOT shown.
 */
function displayProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    
    // Filter: only APPROVED products
    let filteredProducts = products.filter(function(product) {
        return product.status === 'approved';
    });
    
    // Apply category filter
    if (currentCategoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(function(product) {
            return product.category === currentCategoryFilter;
        });
    }
    
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<p class="no-orders">No products in this category</p>';
        return;
    }
    
    filteredProducts.forEach(function(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Show product with Service Offeror name
        productCard.innerHTML = `
            <span class="product-icon">${product.icon || '📦'}</span>
            <h4>${product.name}</h4>
            <span class="product-category">${product.category}</span>
            <div class="product-seller">By: ${product.ownerName}</div>
            <div class="product-price">${product.price} EGP</div>
            <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        
        productsList.appendChild(productCard);
    });
}

/**
 * displayCart()
 * Shows cart items and total.
 */
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0 EGP';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
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
                Remove
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total + ' EGP';
}

/**
 * displayCustomerOrders()
 * Shows orders for the current customer.
 */
function displayCustomerOrders() {
    const ordersContainer = document.getElementById('customerOrders');
    
    const customerOrders = orders.filter(function(order) {
        return order.customerId === currentUser.id;
    });
    
    if (customerOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders yet</p>';
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    customerOrders.forEach(function(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        let itemsList = '';
        order.items.forEach(function(item) {
            itemsList += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} EGP</li>`;
        });
        
        const paymentText = order.paymentMethod === 'cash' ? '🚚 Pay on Delivery' : '💳 Credit Card';
        const statusText = formatStatusName(order.status);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <span class="order-status ${order.status}">${statusText}</span>
            </div>
            <div class="order-items">
                <ul>${itemsList}</ul>
            </div>
            <div class="order-total">Total: ${order.totalPrice} EGP</div>
            <div class="order-payment">${paymentText}</div>
            <div class="order-actions">
                ${order.status === 'pending' ? 
                    `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">Cancel Order</button>` 
                    : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

/**
 * formatStatusName(status)
 * Converts status code to display name.
 * @param {string} status - Status code
 * @returns {string} Display name
 */
function formatStatusName(status) {
    const names = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'on-the-way': 'On the Way',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return names[status] || status;
}

/**
 * displayPendingProducts()
 * Shows products waiting for admin approval.
 */
function displayPendingProducts() {
    const pendingList = document.getElementById('pendingProductsList');
    
    const pendingProducts = products.filter(function(product) {
        return product.status === 'pending';
    });
    
    if (pendingProducts.length === 0) {
        pendingList.innerHTML = '<p class="no-orders">No products pending approval ✅</p>';
        return;
    }
    
    pendingList.innerHTML = '';
    
    pendingProducts.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name}</div>
                <div class="admin-item-details">${product.price} EGP | ${product.category}</div>
                <div class="admin-item-seller">By: ${product.ownerName}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-success btn-sm" onclick="approveProduct(${product.id})">
                    ✅ Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectProduct(${product.id})">
                    ❌ Reject
                </button>
            </div>
        `;
        
        pendingList.appendChild(productItem);
    });
}

/**
 * displayAdminProducts()
 * Shows all products in admin panel.
 */
function displayAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    adminProductsList.innerHTML = '';
    
    products.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        if (product.id === selectedProductId) {
            productItem.classList.add('selected');
        }
        
        const statusBadge = product.status === 'approved' 
            ? '<span class="product-status approved">Approved</span>'
            : '<span class="product-status pending">Pending</span>';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name} ${statusBadge}</div>
                <div class="admin-item-details">${product.price} EGP | ${product.category}</div>
                <div class="admin-item-seller">By: ${product.ownerName}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="selectProduct(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct(${product.id})">Delete</button>
            </div>
        `;
        
        adminProductsList.appendChild(productItem);
    });
}

/**
 * displayServiceProducts()
 * Shows products owned by current service offeror.
 */
function displayServiceProducts() {
    const serviceProductsList = document.getElementById('serviceProductsList');
    
    const ownedProducts = products.filter(function(product) {
        return product.ownerId === currentUser.id;
    });
    
    if (ownedProducts.length === 0) {
        serviceProductsList.innerHTML = '<p class="no-orders">You haven\'t added any products yet</p>';
        return;
    }
    
    serviceProductsList.innerHTML = '';
    
    ownedProducts.forEach(function(product) {
        const productItem = document.createElement('div');
        productItem.className = 'admin-item';
        
        if (product.id === selectedProductId) {
            productItem.classList.add('selected');
        }
        
        const statusBadge = product.status === 'approved' 
            ? '<span class="product-status approved">Approved ✅</span>'
            : '<span class="product-status pending">Pending ⏳</span>';
        
        productItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-name">${product.icon || '📦'} ${product.name} ${statusBadge}</div>
                <div class="admin-item-details">${product.price} EGP | ${product.category}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="selectServiceProduct(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeServiceProduct(${product.id})">Delete</button>
            </div>
        `;
        
        serviceProductsList.appendChild(productItem);
    });
}

/**
 * displayCourierOrders()
 * Shows orders assigned to current courier.
 */
function displayCourierOrders() {
    const courierOrders = document.getElementById('courierOrders');
    
    const assignedOrders = orders.filter(function(order) {
        return order.assignedCourier === currentUser.id;
    });
    
    if (assignedOrders.length === 0) {
        courierOrders.innerHTML = '<p class="no-orders">No assigned orders</p>';
        return;
    }
    
    courierOrders.innerHTML = '';
    
    assignedOrders.forEach(function(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        let itemsList = '';
        order.items.forEach(function(item) {
            itemsList += `<li>${item.name} x${item.quantity}</li>`;
        });
        
        const paymentText = order.paymentMethod === 'cash' ? '🚚 Collect Cash' : '💳 Paid';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">Customer: ${order.customerName}</div>
                </div>
                <span class="order-status ${order.status}">${formatStatusName(order.status)}</span>
            </div>
            <div class="order-items">
                <ul>${itemsList}</ul>
            </div>
            <div class="order-total">Total: ${order.totalPrice} EGP</div>
            <div class="order-payment">${paymentText}</div>
            <div class="order-actions">
                <label>Update Status:</label>
                <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="on-the-way" ${order.status === 'on-the-way' ? 'selected' : ''}>On the Way</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </div>
        `;
        
        courierOrders.appendChild(orderCard);
    });
}


/* ==================== SECTION 8: UTILITY FUNCTIONS ==================== */

/**
 * showToast(message, type)
 * Shows a notification message.
 * @param {string} message - Message to display
 * @param {string} type - "success" or "error"
 */
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    toast.classList.remove('hidden');
    
    setTimeout(function() {
        toast.classList.add('hidden');
    }, 3000);
}


/* ==================== INITIALIZATION ====================
   Code that runs when page loads.
   ======================================================= */

document.addEventListener('DOMContentLoaded', function() {
    console.log('QuickDeliver loaded! 🚀');
    console.log('==========================================');
    console.log('TEST ACCOUNTS:');
    console.log('Admin: admin@email.com / admin123');
    console.log('Customer: ahmed@email.com / 123456');
    console.log('Service Offeror: pizza@email.com / pizza123');
    console.log('Courier: nour@email.com / nour123');
    console.log('==========================================');
});



   

