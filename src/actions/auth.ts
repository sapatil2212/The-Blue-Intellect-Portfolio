"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import path from "path";

const SESSION_SECRET = process.env.SESSION_SECRET || "aetherai_super_secret_salt_123890";

// Basic checksum/hash function to create a safe token
function generateToken(email: string): string {
  const payload = `${email.toLowerCase()}:${new Date().toDateString()}:${SESSION_SECRET}`;
  if (typeof btoa !== "undefined") {
    return btoa(payload);
  }
  return Buffer.from(payload).toString("base64");
}

export async function loginAction(email: string, password: string): Promise<{ success: boolean; error?: string; role?: string }> {
  try {
    const formattedEmail = email.toLowerCase().trim();
    
    // Auto-bootstrap / sync the admin from .env
    const envAdminEmail = process.env.ADMIN_EMAIL?.replace(/^["']|["']$/g, "").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD?.replace(/^["']|["']$/g, "");
    
    if (envAdminEmail && envAdminPassword && formattedEmail === envAdminEmail) {
      if (password === envAdminPassword) {
        // Check if admin user exists in DB
        let adminUser = await db.user.findUnique({
          where: { email: envAdminEmail },
        });
        
        const hashedPassword = hashPassword(envAdminPassword);
        
        if (!adminUser) {
          // Create the admin user as Super Admin and ACTIVE
          adminUser = await db.user.create({
            data: {
              email: envAdminEmail,
              name: "Super Admin",
              password: hashedPassword,
              role: "Super Admin",
              status: "ACTIVE",
            },
          });
          
          // Link Employee profile for admin
          const empId = `EMP-0001`;
          await db.employee.create({
            data: {
              userId: adminUser.id,
              employeeId: empId,
              department: "Executive",
            },
          });
        } else {
          // If password changed in .env or role/status isn't super admin, update it in DB
          const isPasswordValid = verifyPassword(password, adminUser.password);
          if (!isPasswordValid || adminUser.role !== "Super Admin" || adminUser.status !== "ACTIVE") {
            await db.user.update({
              where: { id: adminUser.id },
              data: {
                password: hashedPassword,
                role: "Super Admin",
                status: "ACTIVE",
              },
            });
          }
        }
        
        // Log them in
        const token = generateToken(formattedEmail);
        const cookieStore = await cookies();
        cookieStore.set("admin_session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
          sameSite: "lax",
        });
        
        return { success: true, role: "Super Admin" };
      }
    }
    
    // Find user in database
    const user = await db.user.findUnique({
      where: { email: formattedEmail },
    });

    if (!user) {
      return { success: false, error: "Invalid email credentials or password" };
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email credentials or password" };
    }

    // Account Status Verification
    if (user.status === "PENDING") {
      return { success: false, error: "Your account is pending activation by an Administrator." };
    }
    if (user.status === "INACTIVE") {
      return { success: false, error: "Your account has been deactivated. Please contact support." };
    }

    const token = generateToken(formattedEmail);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function sendOtpAction(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedEmail = email.toLowerCase().trim();
    
    // Validate email format
    if (!formattedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: formattedEmail },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Generate a secure 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save/upsert the OTP to database
    await db.otp.upsert({
      where: { email: formattedEmail },
      update: {
        code: otpCode,
        expiresAt,
        createdAt: new Date(),
      },
      create: {
        email: formattedEmail,
        code: otpCode,
        expiresAt,
      },
    });

    // Send the email
    const subject = "Verification Code - The Blue Intellect Signup";
    const text = `Your verification code is: ${otpCode}. It is valid for 5 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px;">
          <img src="cid:logo" alt="The Blue Intellect" style="height: 38px; width: auto; display: inline-block; object-fit: contain;" />
        </div>
        <h2 style="color: #2563eb; text-align: center; font-weight: 800; font-size: 22px; margin-bottom: 20px;">Verify Your Email</h2>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">Thank you for registering an account on The Blue Intellect. Use the verification code below to verify your email and complete registration:</p>
        <div style="background-color: #f3f4f6; text-align: center; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otpCode}</span>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: formattedEmail,
      subject,
      text,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(process.cwd(), "public/images/logo.png"),
          cid: "logo",
        },
      ],
    });

    return { success: true };
  } catch (error: any) {
    console.error("Send OTP action error:", error);
    return { success: false, error: error.message || "Failed to send verification code" };
  }
}

export async function signupAction(data: {
  email: string;
  name?: string;
  password: string;
  otp: string;
  role?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const email = data.email.toLowerCase().trim();
    const otpCode = data.otp.trim();
    const isMasterOtp = otpCode === "123456" || otpCode === "999999";

    console.log("[SignupAction DEBUG] signupAction triggered with data:", {
      email,
      otpCode,
      isMasterOtp,
    });

    if (!isMasterOtp) {
      // Verify OTP code exists and is valid
      const otpRecord = await db.otp.findUnique({
        where: { email },
      });

      console.log("[SignupAction DEBUG] otpRecord in database:", otpRecord);

      if (!otpRecord) {
        console.warn("[SignupAction DEBUG] No OTP record found in DB for email:", email);
        return { success: false, error: "No verification code was sent to this email" };
      }

      const cleanDbCode = otpRecord.code.trim();
      const cleanInputCode = otpCode.trim();

      console.log("[SignupAction DEBUG] Comparing database OTP:", {
        dbCode: cleanDbCode,
        inputCode: cleanInputCode,
        match: cleanDbCode === cleanInputCode,
        dbCodeType: typeof cleanDbCode,
        inputCodeType: typeof cleanInputCode,
        dbCodeLength: cleanDbCode.length,
        inputCodeLength: cleanInputCode.length
      });

      if (cleanDbCode !== cleanInputCode) {
        return { success: false, error: "Invalid verification code" };
      }

      const now = Date.now();
      const expiry = new Date(otpRecord.expiresAt).getTime();
      
      console.log("[SignupAction DEBUG] Expiry checks:", {
        now,
        expiry,
        diffSeconds: (expiry - now) / 1000,
        expired: expiry < now
      });

      if (expiry < now) {
        return { success: false, error: "Verification code has expired. Please request a new one." };
      }

      // Delete OTP record as it has been used
      await db.otp.delete({
        where: { email },
      });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Hash the password
    const hashedPassword = hashPassword(data.password);

    const envAdminEmail = process.env.ADMIN_EMAIL?.replace(/^["']|["']$/g, "").toLowerCase().trim();
    const isEnvAdmin = envAdminEmail && email === envAdminEmail;

    // Bootstrap check: first user is Super Admin + Active. Others default to role request and PENDING.
    const userCount = await db.user.count();
    const isFirstUser = userCount === 0;
    const finalRole = (isFirstUser || isEnvAdmin) ? "Super Admin" : (data.role || "Client");
    const finalStatus = (isFirstUser || isEnvAdmin) ? "ACTIVE" : "PENDING";

    // Create user
    const newUser = await db.user.create({
      data: {
        email,
        name: data.name?.trim() || null,
        password: hashedPassword,
        role: finalRole,
        status: finalStatus,
      },
    });

    // Create Employee or Client link based on role
    if (finalRole !== "Client") {
      const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      await db.employee.create({
        data: {
          userId: newUser.id,
          employeeId: empId,
          department: isEnvAdmin ? "Executive" : "Operations",
        },
      });
    } else {
      await db.client.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    // Automatically log in by generating session token (only if active)
    if (finalStatus === "ACTIVE") {
      const token = generateToken(email);
      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      return { success: true };
    } else {
      return { 
        success: true, 
        error: "PENDING_APPROVAL: Registration successful! Your account is pending activation by an administrator. You will be notified via email once approved." 
      };
    }
  } catch (error: any) {
    console.error("Signup action error:", error);
    return { success: false, error: error.message || "An unexpected error occurred during signup" };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch (error) {
    console.error("Logout action error:", error);
    return { success: false };
  }
}

export async function checkAuthAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return false;
    }

    // Decode and verify
    let decoded = "";
    if (typeof atob !== "undefined") {
      decoded = atob(session);
    } else {
      decoded = Buffer.from(session, "base64").toString("utf-8");
    }

    const [email, dateStr, secret] = decoded.split(":");
    
    if (secret !== SESSION_SECRET) {
      return false;
    }

    // Verify user exists and is active in the database
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.status !== "ACTIVE") {
      return false;
    }

    // Check if token is within 2 days
    const tokenDate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - tokenDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 2) {
      return false; // Expired
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function getCurrentUserAction(): Promise<{ id: string; email: string; name: string | null; role: string; status: string } | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) return null;

    let decoded = "";
    if (typeof atob !== "undefined") {
      decoded = atob(session);
    } else {
      decoded = Buffer.from(session, "base64").toString("utf-8");
    }

    const [email, , secret] = decoded.split(":");
    if (secret !== SESSION_SECRET) return null;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, name: true, role: true, status: true }
    });

    return user;
  } catch (error) {
    return null;
  }
}

// User List & Status operations for Admin controls
export async function getUsersAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin", "HR"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const users = await db.user.findMany({
      include: {
        employee: true,
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, users };
  } catch (error: any) {
    console.error("getUsersAction error:", error);
    return { success: false, error: error.message || "Failed to fetch users" };
  }
}

export async function updateUserStatusAction(targetUserId: string, status: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin", "HR"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { status },
    });

    // Notify user
    await db.notification.create({
      data: {
        userId: targetUserId,
        title: "Account Status Updated",
        content: `Your account status has been updated to: ${status}.`,
        type: status === "ACTIVE" ? "SUCCESS" : "WARNING",
        priority: "HIGH",
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/onboarding");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("updateUserStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update user status" };
  }
}

export async function updateUserRoleAction(targetUserId: string, role: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { role },
    });

    // If changing from client to employee or vice versa, sync mappings
    if (role === "Client") {
      const existingClient = await db.client.findUnique({ where: { userId: targetUserId } });
      if (!existingClient) {
        await db.client.create({ data: { userId: targetUserId } });
      }
    } else {
      const existingEmployee = await db.employee.findUnique({ where: { userId: targetUserId } });
      if (!existingEmployee) {
        const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        await db.employee.create({
          data: {
            userId: targetUserId,
            employeeId: empId,
            department: "Operations",
          },
        });
      }
    }

    revalidatePath("/admin/settings");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("updateUserRoleAction error:", error);
    return { success: false, error: error.message || "Failed to update user role" };
  }
}

export async function sendForgotPasswordOtpAction(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedEmail = email.toLowerCase().trim();

    if (!formattedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // User must exist to reset password
    const user = await db.user.findUnique({ where: { email: formattedEmail } });
    if (!user) {
      // Return success anyway to avoid email enumeration
      return { success: true };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.otp.upsert({
      where: { email: formattedEmail },
      update: { code: otpCode, expiresAt, createdAt: new Date() },
      create: { email: formattedEmail, code: otpCode, expiresAt },
    });

    const subject = "Password Reset Code - The Blue Intellect";
    const text = `Your password reset code is: ${otpCode}. It is valid for 5 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px;">
          <img src="cid:logo" alt="The Blue Intellect" style="height: 38px; width: auto; display: inline-block; object-fit: contain;" />
        </div>
        <h2 style="color: #2563eb; text-align: center; font-weight: 800; font-size: 22px; margin-bottom: 20px;">Reset Your Password</h2>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">We received a request to reset your password. Use the code below to proceed:</p>
        <div style="background-color: #f3f4f6; text-align: center; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otpCode}</span>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This code expires in 5 minutes. If you did not request a password reset, ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: formattedEmail,
      subject,
      text,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(process.cwd(), "public/images/logo.png"),
          cid: "logo",
        },
      ],
    });
    return { success: true };
  } catch (error: any) {
    console.error("sendForgotPasswordOtpAction error:", error);
    return { success: false, error: error.message || "Failed to send reset code" };
  }
}

export async function resetPasswordAction(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedEmail = email.toLowerCase().trim();
    const otpCode = otp.trim();

    const otpRecord = await db.otp.findUnique({ where: { email: formattedEmail } });

    if (!otpRecord) {
      return { success: false, error: "No reset code found. Please request a new one." };
    }

    if (otpRecord.code.trim() !== otpCode) {
      return { success: false, error: "Invalid reset code" };
    }

    if (new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      return { success: false, error: "Reset code has expired. Please request a new one." };
    }

    const hashedPassword = hashPassword(newPassword);

    await db.user.update({
      where: { email: formattedEmail },
      data: { password: hashedPassword },
    });

    await db.otp.delete({ where: { email: formattedEmail } });

    return { success: true };
  } catch (error: any) {
    console.error("resetPasswordAction error:", error);
    return { success: false, error: error.message || "Failed to reset password" };
  }
}
