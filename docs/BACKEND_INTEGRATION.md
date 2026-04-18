# CampusBazar: Backend Integration Documentation

This document provides a technical blueprint for integrating the CampusBazar React frontend with a backend API. It is based on a deep-dive analysis of the frontend routing, state management, and data flow.

---

## 1. System Overview
CampusBazar is a peer-to-peer campus marketplace allowing students to buy and sell textbooks. The system relies on a central API to manage users, book listings, and orders.

### Tech Stack Recommendation
- **Runtime**: Node.js with Express or NestJS
- **Language**: TypeScript (aligned with frontend logic)
- **Database**: PostgreSQL (Relational structure required for orders/listings)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies

---

## 2. API Reference

### 2.1 Authentication (`/auth`)
| Method | Endpoint | Description | Paylod |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Authenticate user | `{ email, password }` |
| `POST` | `/register` | Create new account | `{ name, email, password, college }` |
| `POST` | `/logout` | Clear auth cookies | `null` |

### 2.2 Marketplace (`/books`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all available books | No |
| `GET` | `/:id` | Get book details | No |
| `POST` | `/` | Create new listing | **Yes** |
| `PUT` | `/:id` | Update listing | **Yes** (Owner only) |
| `DELETE`| `/:id` | Remove listing | **Yes** (Owner only) |

### 2.3 Transactions (`/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new order | **Yes** |
| `GET` | `/me` | Get current user's history | **Yes** |

---

## 3. Database Schema Blueprint

```mermaid
erDiagram
    USERS ||--+o LISTINGS : "owns"
    USERS ||--+o ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    LISTINGS ||--o| ORDER_ITEMS : "referenced in"

    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        string college
        datetime created_at
    }

    LISTINGS {
        uuid id PK
        uuid seller_id FK
        string title
        string author
        decimal price
        string condition
        string category
        string image_url
        boolean is_sold
    }

    ORDERS {
        uuid id PK
        uuid buyer_id FK
        decimal total_amount
        datetime created_at
    }
```

---

## 4. Frontend-to-Backend Data Mapping

### Form: Selling a Book (`SellPage.jsx`)
| Frontend Field | Backend Field | Data Type |
| :--- | :--- | :--- |
| `title` | `title` | String |
| `author` | `author` | String |
| `price` | `price` | Decimal/Float |
| `originalPrice` | `base_price` | Decimal/Float |
| `condition` | `condition_label` | Enum ('New', 'Good', 'Fair') |
| `category` | `category_name` | String |

---

## 5. Implementation Roadmap

1. **Step 1: Auth Module**: Implement JWT strategy and user persistence. Configure CORS to allow the frontend origin.
2. **Step 2: Listing Management**: Build CRUD for books. Implement image upload handling (Multer/S3).
3. **Step 3: Cart Persistence**: Migrate `useCartStore` logic to a `carts` table in the DB for persistence across devices.
4. **Step 4: Order Pipeline**: Implement transaction atomicity (when an order is placed, mark books as `is_sold: true`).

---

> [!IMPORTANT]
> **Integration Security**
> All endpoints under `/books` (write) and `/orders` must implement a middleware that verifies the JWT in the request header/cookie before processing the request.
