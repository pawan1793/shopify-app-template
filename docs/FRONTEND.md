# Frontend Documentation

## Project Structure

The frontend is built using React with TypeScript and follows a modular architecture:

```
frontend/
├── app/
│   ├── routes/           # Application routes and pages
│   ├── lib/             # Shared utilities and hooks
│   └── components/      # Reusable UI components
├── public/              # Static assets
└── prisma/             # Database schema and migrations
```

## Authentication

The frontend implements authentication using the backend API endpoints. Authentication state is managed throughout the application.

### Authentication Flow

1. **Login**
   - Route: `/auth/login`
   - Component: `AuthLogin`
   - Features:
     - Email/password login form
     - Token storage in local storage
     - Automatic redirect after successful login
     - Error handling and validation

2. **Protected Routes**
   - All routes requiring authentication are wrapped with an auth check
   - Unauthorized users are redirected to login
   - Auth token is automatically included in API requests

### Authentication Hooks

```typescript
// Example usage of authentication hooks
import { useAuth } from '~/hooks/useAuth';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Making Authenticated API Calls

```typescript
// Example of making authenticated API calls
const fetchProducts = async () => {
  const response = await fetch('/api/products', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};
```

## Product Management

### Product List Page
- Route: `/products`
- Features:
  - Display list of user's products
  - Sorting and filtering options
  - Product card components
  - Pagination

### Product Details Page
- Route: `/products/:id`
- Features:
  - Display product information
  - Edit product form
  - Delete product confirmation
  - Loading and error states

### Product Forms

#### Create Product Form
```typescript
// Example product creation
const createProduct = async (productData) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};
```

#### Edit Product Form
```typescript
// Example product update
const updateProduct = async (id, productData) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};
```

## State Management

The application uses React's built-in state management along with custom hooks for managing:
- Authentication state
- Product data
- Form states
- Loading states
- Error handling

### Example Custom Hooks

```typescript
// Products hook example
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products logic
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
};
```

## Error Handling

The frontend implements comprehensive error handling:

1. **API Errors**
   - Display user-friendly error messages
   - Handle network errors
   - Handle validation errors
   - Session expiration handling

2. **Form Validation**
   - Client-side validation
   - Display validation errors
   - Field-level error messages

## Components

### Common Components

1. **AuthGuard**
   - Protects routes requiring authentication
   - Handles redirect to login

2. **LoadingSpinner**
   - Displayed during API calls
   - Used in loading states

3. **ErrorBoundary**
   - Catches and displays errors
   - Provides fallback UI

4. **Form Components**
   - Input fields with validation
   - Submit buttons with loading states
   - Error message displays

## Styling

The application uses a consistent styling approach:
- CSS Modules for component-specific styles
- Shared variables for colors, spacing, etc.
- Responsive design patterns
- Accessibility considerations

## Best Practices

1. **Performance**
   - Lazy loading of routes
   - Optimized API calls
   - Proper state management
   - Memoization where necessary

2. **Security**
   - Token management
   - XSS prevention
   - CSRF protection
   - Secure data handling

3. **Code Organization**
   - Consistent file structure
   - Component composition
   - Proper typing
   - Documentation
