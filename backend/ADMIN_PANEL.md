# Admin Panel Documentation

This document provides information about the admin panel implementation for the Laravel 12 application.

## Features

1. **Admin Authentication**
   - Separate admin login page at `/admin/login`
   - Admin credentials stored in the `admins` table
   - Secure authentication using Laravel's built-in authentication system

2. **User Management**
   - View a list of all users in the system
   - Paginated user list with key information (ID, name, email, created date)

3. **User Impersonation**
   - Admins can log in as any user to troubleshoot issues
   - Clear visual indicator when impersonating a user
   - Easy way to exit impersonation mode

## Admin Credentials

The system comes with a default admin user:

- **Email**: admin@example.com
- **Password**: password

It's recommended to change these credentials in a production environment.

## Routes

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **User Management**: `/admin/users`
- **Stop Impersonation**: `/admin/stop-impersonation`

## Implementation Details

### Database Structure

- **admins table**: Stores admin users separately from regular users
- **users table**: Regular application users that can be managed by admins

### Authentication

The admin panel uses a separate authentication guard (`admin`) configured in `config/auth.php`. This ensures that admin authentication is completely separate from user authentication.

### Middleware

- **AdminAuth**: Protects admin routes, ensuring only authenticated admins can access them
- **ImpersonationMiddleware**: Displays a banner when an admin is impersonating a user

### Views

- Admin views are stored in `resources/views/admin/`
- The admin panel uses a separate layout from the main application

## How to Use

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter admin credentials (email: admin@example.com, password: password)
3. You will be redirected to the admin dashboard

### Managing Users

1. From the admin dashboard, click on "Users" in the navigation
2. View the list of all users in the system
3. To impersonate a user, click the "Login as User" button next to their entry

### Impersonating a User

1. When you click "Login as User", you will be logged in as that user
2. A yellow banner will appear at the top of the page indicating you are in impersonation mode
3. To exit impersonation mode, click "Exit Impersonation" in the banner

## Security Considerations

- Admin routes are protected by the `admin` middleware
- Impersonation is tracked using the session to prevent unauthorized access
- When exiting impersonation, the admin is automatically logged back in
