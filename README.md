# Core Features for an Hello Shop Ecomerce Website

# User Authentication & Authorization
Description: Secure registration, login, and role-based access (admin, seller and customer).

Tech Stack: I am use custom JWT authentication; integrated with Prisma & PostgreSQL.

# Product Management
Description: Admins can add, update, delete, and categorize products with images, pricing, stock, and descriptions.

Database: Product data stored in PostgreSQL; image references via cloud (Cloudinary).

# Shopping Cart
Description: Persistent cart system using Redux; users can add/remove items, and adjust quantity.

Optional: Sync cart to DB for logged-in users.

# Checkout System
Description: Order placement with shipping details, payment processing, and order confirmation.

Tech Stack: SSLCommerz integration.

# Order Management
Description: View orders, track statuses (e.g., pending, shipped, delivered); both for admin, seller and customers.

# Product Reviews & Ratings
Description: Logged-in users can review and rate products; display average rating per product.

# Search & Filtering
Description: Search by product name, category, price range, ratings, etc.; server-side filtering using Prisma.

# Inventory Tracking
Description: Auto-adjust inventory on order placement; admin notified when stock is low.

# Category & Subcategory Management
Description: Admin can manage nested categories; users can browse products by category.

# Responsive UI with Animations
Description: Tailwind CSS with Framer Motion for smooth transitions and mobile-friendly design.
