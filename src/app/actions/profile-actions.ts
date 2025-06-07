"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const getCookieString = async () => {
  const cookieStore = await cookies();
  let cookieString = "";
  cookieStore.getAll().forEach((cookie) => {
    cookieString += `${cookie.name}=${cookie.value}; `;
  });
  return cookieString.trim();
};

export async function updateUsername(newUsername: string, currentPassword: string) {
  try {
    const cookie = await getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/user/update-username`, {
      method: 'PUT',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_username: newUsername,
        current_password: currentPassword
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Revalidate user data cache
    revalidateTag('user-data');
    
    return { success: true, message: "Username updated successfully" };
  } catch (error) {
    console.error('Failed to update username:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to update username" 
    };
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const cookie = await getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/user/update-password`, {
      method: 'PUT',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to update password" 
    };
  }
}

export async function deleteAccount() {
  try {
    const cookie = await getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/user/delete`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error('Failed to delete account:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete account" 
    };
  }
}