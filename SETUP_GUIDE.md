# Product CRUD — Setup & Run Guide

**Tech Stack:** Laravel 12 (Backend API) + React.js (Frontend)  
**Database:** MySQL (via XAMPP)

---

## Prerequisites — Install These First

| Tool | Purpose | Download |
|---|---|---|
| **XAMPP** | PHP + MySQL + Apache (all-in-one) | https://www.apachefriends.org |
| **Composer** | PHP dependency manager | https://getcomposer.org |
| **Node.js** (v18+) | Run React frontend | https://nodejs.org |
| **Git** *(optional)* | Clone/manage code | https://git-scm.com |

> ✅ **XAMPP installs PHP and MySQL together** — no separate installation needed for those.

---

## Step 1 — XAMPP Setup

### 1a. Install XAMPP
Download and install XAMPP from https://www.apachefriends.org  
*(Windows: Run the `.exe` installer with default settings)*

### 1b. Start XAMPP Services
1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both should show green status

### 1c. Open phpMyAdmin
Open your browser and go to:
```
http://localhost/phpmyadmin
```

### 1d. Create the Database
In phpMyAdmin:
1. Click **"New"** on the left sidebar
2. Enter database name: `crud_project`
3. Select Collation: `utf8mb4_unicode_ci`
4. Click **"Create"**

Or run this SQL in phpMyAdmin → SQL tab:
```sql
CREATE DATABASE crud_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2 — Backend Setup (Laravel API)

Open **Command Prompt** and navigate into the `backend` folder:

```bash
cd C:\xampp\htdocs\product-crud\backend
```

> 💡 **Tip:** Place the entire `product-crud` folder inside `C:\xampp\htdocs\` for XAMPP to find it.

### 2a. Install PHP dependencies
```bash
composer install
```

### 2b. Copy the environment file
```bash
copy .env.example .env
```

### 2c. Configure `.env` for XAMPP MySQL
Open `.env` in any text editor (Notepad / VS Code) and update:
```
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crud_project
DB_USERNAME=root
DB_PASSWORD=          ← Leave blank (XAMPP default has no password)
```

### 2d. Generate the app key
```bash
php artisan key:generate
```

### 2e. Run database migrations
This creates all 3 tables automatically:
```bash
php artisan migrate
```

When asked *"Do you want to run migrations?"* → press **yes**

### 2f. Enable API routes (Laravel 12 requirement)
```bash
php artisan install:api
```
If asked to run migrations again → press **yes**

### 2g. Create the storage link (for product images)
```bash
php artisan storage:link
```
> If it says "already exists" — that is fine, ignore it.

### 2h. Start the backend server
```bash
php artisan serve
```

✅ Backend API is now running at: **http://localhost:8000**

---

## Step 3 — Frontend Setup (React.js)

Open a **new Command Prompt window** (keep backend terminal running) and navigate to the frontend folder:

```bash
cd C:\xampp\htdocs\product-crud\frontend
```

### 3a. Install Node dependencies
```bash
npm install
```
> ⏳ This will download ~1500 packages and may take 2–5 minutes. Please wait.

### 3b. Start the React app
```bash
npm start
```

✅ Browser will automatically open at: **http://localhost:3000**

---

## Step 4 — Using the Application

Once both servers are running, open your browser and go to:
```
http://localhost:3000
```

You will see the **Neophron Product Suite** dashboard with three modules:

| Module | What it does |
|---|---|
| **Categories** | Add / Edit / Delete product categories |
| **Subcategories** | Add subcategories linked to a category |
| **Products** | Full product master with image upload, MRP & price |

### ⚠️ Recommended order of data entry:
1. Add at least one **Category** first
2. Then add a **Subcategory** under that category
3. Then create a **Product** — dropdowns will auto-populate

---

## Quick Reference — Run the Project Daily

Every time you want to run the project:

**Step 1:** Open XAMPP Control Panel → Start **Apache** + **MySQL**

**Step 2:** Open Command Prompt →
```bash
cd C:\xampp\htdocs\product-crud\backend
php artisan serve
```

**Step 3:** Open another Command Prompt →
```bash
cd C:\xampp\htdocs\product-crud\frontend
npm start
```

**Step 4:** Open browser → http://localhost:3000 ✅

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `composer: command not found` | Install Composer from https://getcomposer.org |
| `react-scripts not recognized` | Run `npm install` inside the `frontend` folder |
| `Database connection refused` | Open XAMPP → Make sure MySQL is Started (green) |
| Images not showing after upload | Run `php artisan storage:link` in backend folder |
| Frontend shows blank screen | Make sure backend is running on port 8000 first |
| Port 8000 already in use | Run `php artisan serve --port=8001` and update `src/services/api.js` baseURL |
| phpMyAdmin not opening | Make sure Apache is Started in XAMPP Control Panel |

---

## Folder Structure

```
product-crud/
├── backend/                        ← Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/       ← CategoryController
│   │   │                             SubcategoryController
│   │   │                             ProductController
│   │   └── Models/                 ← Category, Subcategory, Product
│   ├── database/migrations/        ← Table schemas (auto-run by migrate)
│   ├── routes/api.php              ← All API endpoints
│   ├── storage/app/public/         ← Uploaded product images stored here
│   └── .env                        ← Database configuration
│
└── frontend/                       ← React.js SPA
    └── src/
        ├── App.js                  ← Main layout + sidebar navigation
        ├── App.css                 ← Styling
        ├── services/api.js         ← Axios API calls to Laravel
        └── components/
            ├── categories/         ← CategoryList, CategoryForm
            ├── subcategories/      ← SubcategoryList, SubcategoryForm
            └── products/           ← ProductList, ProductForm (with image)
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/{id} | Update category |
| DELETE | /api/categories/{id} | Delete category |
| GET | /api/subcategories | List all subcategories |
| POST | /api/subcategories | Create subcategory |
| PUT | /api/subcategories/{id} | Update subcategory |
| DELETE | /api/subcategories/{id} | Delete subcategory |
| GET | /api/categories/{id}/subcategories | Get subcategories by category |
| GET | /api/products | List all products |
| POST | /api/products | Create product (with image) |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |

---

*Built by Gangatharan as part of the Neophron Technologies evaluation task.*  
*Stack: Laravel 12 + React.js + MySQL (XAMPP)*
