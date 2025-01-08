# 🌟 E-Commerce Website

Welcome to the **E-Commerce Website** repository! This platform is designed to provide a seamless shopping experience with modern web technologies and responsive design. 🚀

---

## ✨ Features

- **🛍️ Product Management:**
  - Dynamic product pages with **server-side rendering (SSR)** to enhance performance and SEO.
  - Detailed product information, including reviews and ratings, to help customers make informed decisions.

- **🔐 User Authentication:**
  - Secure login and registration using **JSON Web Tokens (JWT)**.
  - Support for social login (Google, Facebook) for hassle-free account creation.

- **🛒 Shopping Cart:**
  - Add, update, and remove items with ease.
  - Persistent cart state using **localStorage/sessionStorage** to enhance user experience.

- **📦 Order Management:**
  - Comprehensive order tracking and history.
  - Integration with **payment gateways** like Stripe or Razorpay for smooth transactions.

- **📊 Admin Dashboard:**
  - Manage products and orders effectively.
  - Gain insights with analytics to track sales and performance.

- **📱 Responsive Design:**
  - Optimized for mobile, tablet, and desktop devices, ensuring a consistent experience across all platforms.

---

## 🛠️ Tech Stack

### 🌐 Frontend

- **Next.js:**
  - A powerful React framework offering **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)**.
  - Ensures faster page loads, better SEO, and a smoother user experience.

- **Tailwind CSS:**
  - A modern utility-first CSS framework.
  - Simplifies the creation of responsive and visually appealing designs with pre-defined utility classes.

- **React Query:**
  - A state management library for server-side data fetching and caching.
  - Ensures data synchronization and improves API handling efficiency.

### 🖥️ Backend

- **Node.js:**
  - A JavaScript runtime for building fast, scalable, and high-performance backend applications.

- **Express.js:**
  - A minimalist web framework for Node.js.
  - Simplifies routing and middleware management for creating robust APIs.

- **MongoDB:**
  - A NoSQL database for managing application data.
  - Offers flexibility to store structured, semi-structured, or unstructured data efficiently.

- **Mongoose:**
  - An ODM (Object Data Modeling) library for MongoDB.
  - Facilitates schema validation, data modeling, and querying.

### 🔐 Authentication

- **NextAuth.js:**
  - A full-featured authentication solution for Next.js.
  - Supports multiple providers (Google, Facebook, etc.) and secure session handling via JWT.

### 💳 Payments

- **Stripe API:**
  - A robust platform for handling online payments.
  - Enables multi-currency support and ensures secure transactions.

- **Razorpay:**
  - A payment gateway tailored for Indian businesses.
  - Offers local payment options like UPI, wallets, and credit cards.

---

## ⚙️ Installation

1. **📂 Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/ecommerce-website.git
   cd ecommerce-website
   ```

2. **📦 Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **🔧 Configure Environment Variables:**

   Create a `.env.local` file in the root directory and add the required variables for API endpoints, database credentials, JWT secrets, and payment gateway keys.

4. **🚀 Run the Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

5. **🔙 Start the Backend Server (if applicable):**

   Navigate to the `backend` directory and execute the following:

   ```bash
   cd backend
   npm start
   ```

---

## 🧭 Usage Guide

- **🏠 Home Page:** Browse featured products and categories at a glance.
- **📄 Product Page:** View detailed information, including specifications, reviews, and ratings.
- **🛒 Cart Page:** Add products to your cart, modify quantities, or remove items.
- **💳 Checkout Page:** Securely complete payments and confirm your order.
- **📋 Admin Dashboard:** Manage products, view orders, and track sales.

---

## 📸 Screenshots

| 🏠 Home Page | 📄 Product Page |
|-------------|----------------|
| ![Home](./screenshots/home.png) | ![Product](./screenshots/product.png) |

| 🛒 Cart Page | 📋 Admin Dashboard |
|-------------|--------------------|
| ![Cart](./screenshots/cart.png) | ![Admin](./screenshots/admin.png) |

---

## 🤝 Contributing

We welcome contributions! Here’s how you can help:

1. **Fork** the repository.
2. **Create a branch** for your feature: `git checkout -b feature-name`.
3. **Commit your changes:** `git commit -m 'Add new feature'`.
4. **Push to the branch:** `git push origin feature-name`.
5. **Submit a Pull Request** with detailed notes on your changes.

---

## 📧 Contact

For any queries or collaboration opportunities:

- **Name:** Mahesh Nayak
- **Email:** [merndeveloper.mahesh@gmail.com](mailto:merndeveloper.mahesh@gmail.com)
- **Portfolio:** [https://maphy-e-commerce-app.vercel.app/](#)
