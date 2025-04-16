# Backend Documentation

## Authentication

The backend uses Laravel Sanctum for API token authentication. All authenticated endpoints require a Bearer token that can be obtained through the login endpoint.

### Authentication Endpoints

#### Login
- **URL:** `POST /api/login`
- **Description:** Authenticate a user and get an access token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response (200):**
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "token": "your-auth-token"
  }
  ```
- **Response (422):** Validation errors

#### Logout
- **URL:** `POST /api/logout`
- **Description:** Invalidate the current user's token
- **Authentication:** Required (Bearer Token)
- **Response (200):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get Current User
- **URL:** `GET /api/user`
- **Description:** Get the authenticated user's information
- **Authentication:** Required (Bearer Token)
- **Response (200):**
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
  ```

## Products API

All product endpoints require authentication using a Bearer token.

### Product Endpoints

#### List Products
- **URL:** `GET /api/products`
- **Description:** Get all products for the authenticated user
- **Authentication:** Required (Bearer Token)
- **Response (200):** Array of products
  ```json
  [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": "99.99",
      "user_id": 1,
      "created_at": "2024-03-21T12:00:00.000000Z",
      "updated_at": "2024-03-21T12:00:00.000000Z"
    }
  ]
  ```

#### Create Product
- **URL:** `POST /api/products`
- **Description:** Create a new product
- **Authentication:** Required (Bearer Token)
- **Request Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99
  }
  ```
- **Response (201):** Created product object

#### Get Single Product
- **URL:** `GET /api/products/{id}`
- **Description:** Get a specific product by ID
- **Authentication:** Required (Bearer Token)
- **Response (200):** Product object
- **Response (403):** Unauthorized if product doesn't belong to user

#### Update Product
- **URL:** `PUT/PATCH /api/products/{id}`
- **Description:** Update a specific product
- **Authentication:** Required (Bearer Token)
- **Request Body:** (all fields optional)
  ```json
  {
    "name": "Updated Name",
    "description": "Updated Description",
    "price": 149.99
  }
  ```
- **Response (200):** Updated product object
- **Response (403):** Unauthorized if product doesn't belong to user

#### Delete Product
- **URL:** `DELETE /api/products/{id}`
- **Description:** Delete a specific product
- **Authentication:** Required (Bearer Token)
- **Response (204):** No content on success
- **Response (403):** Unauthorized if product doesn't belong to user

## Making Authenticated Requests

To make authenticated requests, include the Bearer token in the Authorization header:

```http
Authorization: Bearer your-auth-token
```

Example using cURL:
```bash
curl -X GET http://your-api-url/api/products \
  -H "Authorization: Bearer your-auth-token" \
  -H "Accept: application/json"
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400:** Bad Request - Invalid input
- **401:** Unauthorized - Missing or invalid authentication
- **403:** Forbidden - Not allowed to access the resource
- **404:** Not Found - Resource doesn't exist
- **422:** Unprocessable Entity - Validation errors
- **500:** Server Error - Something went wrong on the server
