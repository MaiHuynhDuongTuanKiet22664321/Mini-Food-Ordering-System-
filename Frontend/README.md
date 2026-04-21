# Mini Food Ordering System - ReactJS Frontend

A ReactJS application for a mini food ordering system with microservices architecture.

## Tech Stack

- ReactJS 18.2.0
- Axios 1.6.0
- React Router DOM 6.20.0

## API Services

- **User Service**: http://localhost:3001
- **Food Service**: http://localhost:3002
- **Order Service**: http://localhost:3003
- **Payment Service**: http://localhost:3004

## Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Login component
│   │   ├── Register.js       # Register component
│   │   ├── FoodList.js       # Food list display component
│   │   ├── Cart.js           # Shopping cart component
│   │   ├── Order.js          # Order placement component
│   │   ├── Navbar.js         # Navigation bar component
│   │   ├── Login.css
│   │   ├── FoodList.css
│   │   ├── Cart.css
│   │   ├── Order.css
│   │   └── Navbar.css
│   ├── contexts/
│   │   ├── AuthContext.js    # Authentication context (token, user state)
│   │   └── CartContext.js    # Shopping cart context
│   ├── services/
│   │   └── api.js            # Axios API service layer
│   ├── App.js                # Main app component with routing
│   ├── App.css
│   └── index.js              # Entry point
├── package.json
└── README.md
```

## Component Structure

### 1. **Login Component** (`src/components/Login.js`)
- User authentication form
- Calls `userLogin()` API
- Stores token in localStorage via AuthContext
- Toggle to Register view

### 2. **Register Component** (`src/components/Register.js`)
- User registration form
- Calls `userRegister()` API
- Auto-login after successful registration

### 3. **FoodList Component** (`src/components/FoodList.js`)
- Displays all available foods from Food Service
- Grid layout with food cards
- "Add to Cart" functionality
- Uses `getFoodList()` API

### 4. **Cart Component** (`src/components/Cart.js`)
- Displays cart items with quantities
- Quantity adjustment (+/-)
- Remove items from cart
- Calculates subtotal, tax, and total
- "Proceed to Checkout" button

### 5. **Order Component** (`src/components/Order.js`)
- Delivery information form (address, phone, notes)
- Order summary display
- Calls `createOrder()` API
- Calls `createPayment()` API
- Clears cart after successful order

### 6. **Navbar Component** (`src/components/Navbar.js`)
- Navigation menu
- Cart badge showing item count
- Login/Logout functionality
- Route navigation

## Context API

### AuthContext (`src/contexts/AuthContext.js`)
- Manages user authentication state
- Stores token and user data in localStorage
- Provides `login()`, `logout()`, `user`, `token`

### CartContext (`src/contexts/CartContext.js`)
- Manages shopping cart state
- Stores cart in localStorage
- Provides `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
- Calculates `cartTotal` and `cartCount`

## API Service Layer (`src/services/api.js`)

### User Service API Calls
```javascript
import { userLogin, userRegister, getUserProfile } from './services/api';

// Login
const response = await userLogin(email, password);
// Returns: { user: {...}, token: "..." }

// Register
const response = await userRegister(name, email, password);
// Returns: { user: {...}, token: "..." }

// Get User Profile
const response = await getUserProfile();
// Returns: { id, name, email, ... }
```

### Food Service API Calls
```javascript
import { getFoodList, getFoodById } from './services/api';

// Get all foods
const foods = await getFoodList();
// Returns: [{ id, name, description, price, image }, ...]

// Get food by ID
const food = await getFoodById(foodId);
// Returns: { id, name, description, price, image }
```

### Order Service API Calls
```javascript
import { createOrder, getOrders, getOrderById } from './services/api';

// Create order
const order = await createOrder({
  userId: user.id,
  items: [{ foodId, quantity, price }],
  totalAmount: 100,
  address: "123 Street",
  phone: "1234567890",
  notes: "Extra sauce"
});
// Returns: { id, userId, items, totalAmount, status, ... }

// Get all orders
const orders = await getOrders();
// Returns: [{ id, ... }, ...]

// Get order by ID
const order = await getOrderById(orderId);
// Returns: { id, userId, items, totalAmount, status, ... }
```

### Payment Service API Calls
```javascript
import { createPayment, getPaymentStatus } from './services/api';

// Create payment
const payment = await createPayment({
  orderId: order.id,
  amount: 100,
  method: 'credit_card'
});
// Returns: { id, orderId, amount, status, ... }

// Get payment status
const status = await getPaymentStatus(paymentId);
// Returns: { status: 'completed' | 'pending' | 'failed', ... }
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Features

- ✅ User authentication (Login/Register)
- ✅ Token-based authentication with localStorage
- ✅ Food list display from Food Service
- ✅ Shopping cart with quantity management
- ✅ Order creation with delivery information
- ✅ Payment integration
- ✅ Responsive design
- ✅ Route protection for authenticated users

## API Endpoints

### User Service (http://localhost:3001)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /user/profile` - Get user profile

### Food Service (http://localhost:3002)
- `GET /foods` - Get all foods
- `GET /foods/:id` - Get food by ID

### Order Service (http://localhost:3003)
- `POST /orders` - Create new order
- `GET /orders` - Get all user orders
- `GET /orders/:id` - Get order by ID

### Payment Service (http://localhost:3004)
- `POST /payments` - Create payment
- `GET /payments/:id/status` - Get payment status

## Usage Flow

1. **Login/Register** - User authenticates via User Service
2. **Browse Foods** - View food list from Food Service
3. **Add to Cart** - Add items to shopping cart
4. **View Cart** - Review cart items and totals
5. **Place Order** - Submit order with delivery info to Order Service
6. **Payment** - Process payment via Payment Service
7. **Confirmation** - Display order success message
