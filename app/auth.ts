import { TokenInfoManagement, UsersProfileManager } from "@/types/auth.type";
import { redirect } from "@remix-run/node";

export const tokensManagement = new TokenInfoManagement;
export const usersManager = new UsersProfileManager;

// export function getRefreshToken(cookieString: string | null): string | null {
//   if (!cookieString) return null;
//   const match = cookieString.match(/(?:^|;\s*)refresh-token=([^;]*)/);
//   return match ? decodeURIComponent(match[1]) : null;
// }

// export async function requireAuthCookie(request: Request) {
//   let cookieString = request.headers.get("Cookie");
//   let refreshToken = getRefreshToken(cookieString);
//   if (_.isEmpty(refreshToken) || !refreshToken || refreshToken === "''") {
//     console.log("[RequireAuthCookie] Redirect to /auth");
//     throw redirect("/auth", {
//       headers: {
//         "Set-Cookie": "refresh-token=''"
//       }
//     })
//   }
//   return refreshToken;
// }