
/// <reference types="vite/client" />

// Custom user type for our authentication system
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'owner' | 'staff' | null;
}
