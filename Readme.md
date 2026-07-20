# E-Commerce Backend API (MVC Architecture)

A highly structured, production-ready RESTful E-Commerce Backend API built using Node.js, Express, and Mongoose. This system features dynamic product filtering, an in-memory cart engine with strict server-side price validation, automated stock control checkout mapping pipelines, and global centralized error handling.

Developed as a capstone project submission under the strict evaluation rubric criteria for **Digital Egypt Cubs**.

---

## 🚀 Core Features

* **MVC Design Pattern:** Completely modularized file architecture organizing isolated logic routines across dedicated domain levels.
* **Robust Dynamic Filtering:** Endpoint search engine optimization filters catalog structures dynamically by Category ID, `minPrice`, `maxPrice`, `inStock` boolean, or `search` string matching properties.
* **Secure Cart Processing Engine:** Computes pricing variables directly from the database server state to shield orders from malicious client payload manipulation. Includes automatic item removal when quantities reach zero.
* **Transactional Checkout Pipeline:** Automatically flags out-of-stock items, decreases warehouse units post-success, clears user cart balances, and assigns unique, random alphanumeric order tracking numbers.
* **Centralized Error Middleware Handler:** Custom-built operational error capture mechanism handles Mongoose `ValidationError` (400), `CastError` (400), and `Duplicate Key` database indexing collision scenarios (409).
* **Input Protection Pipeline:** Features strict database sanitization utilities (`mongo-sanitize`) to neutralize injection attacks at the middleware entry point.

---

## 🛠️ Technology Stack & Dependencies

* **Runtime Environment:** Node.js (v18+ recommended)
* **Framework Engine:** Express.js (v4.19+)
* **Database OMR:** Mongoose / MongoDB Atlas cloud instance (v8.4+)
* **Validation Layer:** Express-Validator
* **Security Utilities:** Mongo-Sanitize
* **Configuration Manager:** Dotenv

---

## 📁 Project Architecture Blueprint

```text
📁 e-commerce-backend-api/
│
├── 📁 config/
│   └── 📄 db.js                 # Contains connectDB() handler
│
├── 📁 models/
│   ├── 📄 category.model.js     # Category database model structure
│   ├── 📄 product.model.js      # Product database model structure
│   ├── 📄 cart.model.js         # Cart schema profile storage definition
│   └── 📄 order.model.js        # Final checkout transactional invoice model
│
├── 📁 controllers/
│   ├── 📄 category.controller.js
│   ├── 📄 product.controller.js
│   ├── 📄 cart.controller.js
│   └── 📄 order.controller.js
│
├── 📁 routes/
│   ├── 📄 category.routes.js     # Mount point: /api/categories
│   ├── 📄 product.routes.js      # Mount point: /api/products
│   ├── 📄 cart.routes.js         # Mount point: /api/cart
│   └── 📄 order.routes.js        # Mount point: /api/orders
│
├── 📁 middleware/
│   └── 📄 errorHandler.js       # Global operational error parsing pipeline
│
├── 📁 utils/
│   ├── 📄 AppError.js           # Extended core JavaScript Error constructor
│   └── 📄 asyncHandler.js       # Structural try/catch controller wrapper
│
├── 📁 postman/
│   └── 📄 collection.json       # Exported evaluation postman test cases file
│
├── 📄 .env.example              # Template containing environmental variables variables
├── 📄 .gitignore                # Excludes node_modules/ and secret key logs
├── 📄 app.js                    # Core Application assembly entrypoint file
├── 📄 seed.js                   # Automated database records populator tool
└── 📄 package.json              # System configuration scripts manifests