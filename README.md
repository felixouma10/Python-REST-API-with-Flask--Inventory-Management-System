# Stockroom Inventory Management

A small inventory management application with a Flask REST API, a React admin
portal, and an Open Food Facts product lookup. Inventory is stored in a Python
list in memory, so it resets when the API server restarts.

## Project layout

```text
inventory_backend/
  app.py                 Flask API and Open Food Facts integration
  requirements.txt       Python dependencies
  tests/                 API and CLI tests
inventory_frontend/
  src/App.jsx            React inventory portal
  src/index.css          Portal styles
```

## Run the application

### 1. Start the Flask API

In a terminal, from the project root:

```bash
cd inventory_backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

The API listens at `http://127.0.0.1:5000`. On Windows, activate the virtual
environment with `.venv\Scripts\activate` instead.

### 2. Start the React portal

In another terminal:

```bash
cd inventory_frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend uses
`http://127.0.0.1:5000` by default. To use a different backend, create
`inventory_frontend/.env.local` and set `VITE_API_URL`, for example:

```text
VITE_API_URL=http://127.0.0.1:5000
```

## REST API

All responses use JSON except for the successful delete response, which has an
empty body.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Check that the API is running |
| `GET` | `/inventory` | List all inventory items |
| `GET` | `/inventory/<id>` | Get one item |
| `POST` | `/inventory` | Add an item |
| `PATCH` | `/inventory/<id>` | Update one or more item fields |
| `DELETE` | `/inventory/<id>` | Delete an item |
| `GET` | `/inventory/search?query=<barcode-or-name>` | Search Open Food Facts |

An item requires a non-empty `name`, a non-negative numeric `price`, and a
non-negative whole-number `quantity`. Optional fields are `brand`, `category`,
`barcode`, `ingredients_text`, and `image_url`.

Create an item:

```bash
curl -X POST http://127.0.0.1:5000/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"Organic Almond Milk","brand":"Silk","category":"Drinks","price":4.99,"quantity":12}'
```

Update stock:

```bash
curl -X PATCH http://127.0.0.1:5000/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":20}'
```

Search by barcode or name:

```bash
curl "http://127.0.0.1:5000/inventory/search?query=organic%20almond%20milk"
```

The search endpoint returns the matching product details; add those details
through `POST /inventory` to save them in the in-memory inventory.

## Tests and frontend checks

From `inventory_backend` with its virtual environment activated:

```bash
python -m pytest
```

From `inventory_frontend`:

```bash
npm run lint
npm run build
```
