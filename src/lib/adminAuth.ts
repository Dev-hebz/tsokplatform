import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if a user has admin privileges
 * @param userId - Firebase Auth user ID
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * List of admin email addresses
 * Add your admin emails here
 */
export const ADMIN_EMAILS = [
  '1@gmail.com', // Replace with your actual admin email
  // Add more admin emails here:
  // 'admin2@example.com',
  // 'admin3@example.com',
];

/**
 * Check if email is in admin list
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
