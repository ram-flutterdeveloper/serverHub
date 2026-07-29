import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  emailVerified: boolean;
}

export class GoogleHelper {
  static async verifyToken(
    idToken: string
  ): Promise<GoogleUser> {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return {
      googleId: payload.sub,

      email: payload.email || "",

      firstName: payload.given_name || "",

      lastName: payload.family_name || "",

      profileImage: payload.picture || null,

      emailVerified:
        payload.email_verified || false,
    };
  }
}