# GALA Inventory Management System

GALA is an inventory management application built with **Python, Flask, React and Vite**. It helps businesses manage products, monitor stock levels, track inventory value and retrieve product information from external databases.

## 1. Technologies Used

**Backend**
- Python
- Flask
- Flask-CORS
- Requests
- python-dotenv

**Frontend**
- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React

**External APIs**
- USDA FoodData Central
- OpenFoodFacts

## 2. Key Features

- Dashboard displaying total products, stock quantity and inventory value.
- Add, view, update and delete inventory products.
- Low-stock and out-of-stock alerts.
- Search products by name using USDA FoodData Central.
- Search products by barcode using OpenFoodFacts.
- Select external products and populate the inventory form.
- Add retrieved products to the local inventory.

## 3. Project Structure

```text
Python-REST-API-with-Flask--Inventory-Management-System/
│
├── inventory_backend/
│   ├── app.py
│   ├── inventory.py
│   ├── external_api.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
├── inventory_frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
└── README.md
```

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/inventory` | Retrieve all products |
| GET | `/inventory/<product_id>` | Retrieve one product |
| POST | `/inventory` | Add a product |
| PATCH | `/inventory/<product_id>` | Update a product |
| DELETE | `/inventory/<product_id>` | Delete a product |
| GET | `/products/search?name=milk` | Search by product name |
| GET | `/products/search?barcode=...` | Search by barcode |

Backend address: `http://127.0.0.1:5555`

## 5. Installation and Setup

### Prerequisites

- Python 3.8 or later
- Node.js and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/felixouma10/Python-REST-API-with-Flask--Inventory-Management-System.git

cd Python-REST-API-with-Flask--Inventory-Management-System
```

### Backend Setup

Navigate to the backend:

```bash
cd inventory_backend
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside `inventory_backend/`:

```env
USDA_API_KEY=your_usda_api_key
```

Get an API key from:

https://fdc.nal.usda.gov/api-key-signup/

The `.env` file is excluded from Git to protect sensitive information.

### Run the Backend

```bash
python app.py
```

Backend runs at:

`http://127.0.0.1:5555`

### Frontend Setup

Open a second terminal and navigate to the frontend:

```bash
cd inventory_frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 6. Testing

The following functionality has been manually tested:

- Flask backend and API routes.
- Inventory CRUD operations.
- USDA product name search.
- OpenFoodFacts barcode search.
- External product selection and inventory entry.
- Frontend and backend communication.

Both external API integrations returned successful responses during testing.

## Author

Felix Ouma
