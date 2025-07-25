"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email, profileURL } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      profileURL: profileURL || null,
      resumeURL: null,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === "auth/email-already-exists") {
        return {
          success: false,
          message: "This email is already in use",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
    
    return {
      success: true,
      message: "Successfully signed in.",
    };
  } catch (error: unknown) {
    console.error("Error signing in:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error: unknown) {
    console.error("Error getting current user:", error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Updated function without 'any' type
export async function updateUserProfile(params: {
  userId: string;
  profileURL?: string;
  name?: string;
}) {
  const { userId, profileURL, name } = params;

  try {
    // Use proper typing instead of 'any'
    const updateData: Partial<{
      profileURL: string | null;
      name: string;
      updatedAt: string;
    }> = {};
    
    if (profileURL !== undefined) updateData.profileURL = profileURL;
    if (name !== undefined) updateData.name = name;
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    await db.collection("users").doc(userId).update(updateData);

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}
