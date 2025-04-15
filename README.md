This repository contains a starter template for building a Shopify app with a Laravel backend and a Shopify Remix frontend.

---

## 🧰 Stack

- **Backend**: Laravel 12
- **Frontend**: Shopify Remix (using App Bridge + Polaris)
- **API Communication**: REST API between Laravel and Remix frontend
- **Authentication**: OAuth with Shopify

---

## 📁 Project Structure

The project is currently in its initial setup phase. The following structure will be implemented:

```
shopify-app-template/
├── backend/                  # Laravel application
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── public/
│   └── ...
├── frontend/                # Shopify Remix app
│   ├── app/
│   ├── public/
│   ├── remix.config.js
│   └── ...
├── .env
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- Docker (optional but recommended)
- A Shopify Partner Account

---

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pawan1793/shopify-app-template.git
cd shopify-app-template
```

### 2. Laravel Backend Setup

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

Update `.env` with your Shopify credentials:

```env
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_SCOPES=read_products,write_products
SHOPIFY_APP_URL=https://your-ngrok-url
```

### 3. Frontend Remix Setup

```bash
cd ../frontend
npm install
npm run dev
```

Update `app/config/shopify.ts` with the correct API key and app URL.

### 4. Create Ngrok Tunnel (for Shopify app callback)

```bash
ngrok http 3000
```

Update both `.env` and frontend `shopify.ts` with the HTTPS Ngrok URL.

---

## 🔐 Shopify OAuth Flow

1. Merchant installs the app from the Shopify store.
2. Redirects to Laravel backend for OAuth.
3. Laravel verifies and stores access token.
4. Merchant is redirected to the Remix app with authenticated session.

---

## 📦 API Example

Laravel route (backend/routes/api.php):
```php
Route::middleware('auth.shopify')->get('/products', [ProductController::class, 'index']);
```

Frontend API call:
```ts
const res = await fetch("/api/products");
const products = await res.json();
```

---

## 🧪 Testing

```bash
cd backend
php artisan test

cd ../frontend
npm run test
```

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

---

## 📚 Resources

- [Shopify App CLI](https://shopify.dev/docs/apps/tools/cli)
- [Laravel Docs](https://laravel.com/docs)
- [Remix Shopify Starter](https://github.com/Shopify/shopify-app-template-remix)

---

## ✨ Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---


