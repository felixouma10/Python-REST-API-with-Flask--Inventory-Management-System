# GALA – Inventory Management System

GALA is an inventory management application built with a Flask REST API and a React frontend. It helps users manage inventory, monitor stock levels, and retrieve product information through external product databases.

## Technology Stack

- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** React, Vite, Tailwind CSS
- **Icons:** Lucide React
- **External APIs:** Open Food Facts and USDA FoodData Central
- **Data Storage:** In-memory Python list

## Project Structure

```text
inventory_backend/
  app.py
  inventory.py
  external_api.py
  requirements.txt

inventory_frontend/
  src/
    components/
    services/
    App.jsx
    index.css
    main.jsx
```

## Getting Started

### 1. Backend Setup

Navigate to the backend:

```bash
cd inventory_backend
```

Activate the existing virtual environment:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

Backend runs at:

`http://127.0.0.1:5555`

### 2. Frontend Setup

Open another terminal:

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

Open the URL provided by Vite, normally:

`http://localhost:5173`

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/inventory` | Retrieve all products |
| GET | `/inventory/<id>` | Retrieve one product |
| POST | `/inventory` | Add a product |
| PATCH | `/inventory/<id>` | Update a product |
| DELETE | `/inventory/<id>` | Delete a product |
| GET | `/products/search?barcode=<code>` | Search by barcode |
| GET | `/products/search?name=<name>` | Search by product name |

## External Product Search

StockWise integrates two external product data sources:

- **Open Food Facts:** Barcode-based product lookup.
- **USDA FoodData Central:** Product name search for branded food products.

A USDA API key can be configured using the `USDA_API_KEY` environment variable.

## Data Storage

The current application uses an in-memory Python list to store inventory records. Inventory data resets when the Flask server restarts.

## Author

Felix Ouma
