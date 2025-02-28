import { SurveyTags, UserInfo } from "@/interfaces/userInterace";
// import * as jwt from 'jsonwebtoken'

/** Manages user access token (UAT) and refresh token (RFT) */
export class TokenInfoManagement {
    private uat: string | null = null;
    private rftOnCookie: string = "";
    private isCookieNeedUpdate: boolean = false;
    private setCookieString: string = "";
  
    /** Set or retrieve UAT */
    setUAT(token: string) {
      this.uat = token;
    }
    retrieveUAT(): string | null {
      return this.uat;
    }
  
    /** Set or retrieve refresh token */
    setInitRFCookie(rf: string | null) {
      if (!this.rftOnCookie) {
        this.rftOnCookie = rf || "";
      }
    }
    setNewRF(rf: string | null) {
      console.log("[Server] Set New Cookie");
      this.rftOnCookie = rf || "";
    }
    retrieveCookie(): string {
      return this.rftOnCookie;
    }
  
    /** Manage cookie update state */
    setNeedUpdateCookie(value: boolean) {
      this.isCookieNeedUpdate = value;
    }
    getNeedUpdateCookie(): boolean {
      return this.isCookieNeedUpdate;
    }
  
    /** Set or retrieve set-cookie string */
    setSetCookieString(value: string) {
      this.setCookieString = value;
    }
    getSetCookieString(): string {
      return this.setCookieString;
    }
  
    getHeadersConfig() {
      return {
        Authorization: `Bearer ${this.uat}`,
        Cookie: "refresh-token=" + this.rftOnCookie
      }
    }
}

/** Represents a user's profile */
class UserDetailInfo {
    private username: string;
    private id: string;
    private email?: string;
    private firstName?: string;
    private lastName?: string;
    private dateOfBirth?: string;
    private isAuthenticatedWithGoogle?: boolean;
    private phoneNumber?: number;
    public tokensInfo: TokenInfoManagement;
    private survey?: SurveyTags[];
    private role?: string;
    private joinDate?: Date;
    private profile?: any;
  
    constructor(userData: UserInfo) {
      this.username = userData.username;
      this.id = userData.id;
      this.email = userData.email;
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.dateOfBirth = userData.dateOfBirth;
      this.isAuthenticatedWithGoogle = userData.isAuthenticatedWithGoogle;
      this.phoneNumber = userData.phoneNumber;
      this.survey = userData.survey;
      this.role = userData.role;
      this.joinDate = userData.joinDate;
      this.profile = userData.profile;
      this.tokensInfo = new TokenInfoManagement();
    }
  
    /** Update user profile */
    setInfo(userData: UserInfo) {
      this.email = userData.email;
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.dateOfBirth = userData.dateOfBirth;
      this.isAuthenticatedWithGoogle = userData.isAuthenticatedWithGoogle;
      this.phoneNumber = userData.phoneNumber;
      this.survey = userData.survey;
      this.role = userData.role;
      this.joinDate = userData.joinDate;
      this.profile = userData.profile;
    }
  
    /** Retrieve user profile */
    getInfo(): UserInfo {
      return {
        username: this.username,
        id: this.id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        isAuthenticatedWithGoogle: this.isAuthenticatedWithGoogle,
        phoneNumber: this.phoneNumber,
        survey: this.survey,
        role: this.role,
        joinDate: this.joinDate,
        profile: this.profile
      };
    }
  
    emptySurveyTags() {
      this.survey = [];
    }
  }

/** Manages multiple users' profiles */
export class UsersProfileManager {
    private userProfiles: Map<string, UserDetailInfo>;
  
    constructor() {
      this.userProfiles = new Map();
    }
  
    // /** Decode JWT token to extract user ID or username */
    // decodeToken(token: string): { id: string; username: string, role: string } | null {
    //   try {
    //     const decoded = jwt.decode(token) as { sub?: string; username?: string; role? : string } | null;
    //     if (!decoded || (!decoded.sub && !decoded.username)) return null;
    //     return { id: decoded.sub || "", username: decoded.username || "", role : decoded.role || "" };
    //   } catch (error) {
    //     console.error("Failed to decode JWT:", error);
    //     return null;
    //   }
    // }
  
    // /** Initialize user profile based on the decoded token*/
    // initUserProfile(token: string | null): boolean {
    //   if (!token) return false;
    //   const payload = this.decodeToken(token);
    //   if (!payload) {
    //     console.warn("No token found, cannot set user profile.");
    //     return false;
    //   }
    //   const keyUser = payload.id;
    //   if (!keyUser) {
    //     console.warn("No valid identifier found in token.");
    //     return false;
    //   }
  
    //   // Create new user profile
    //   if (!this.userProfiles.has(keyUser)) {
    //     console.log("[Sever] Create new user profile");
    //     // Default info
    //     const newUserInfo: UserDetailInfo = new UserDetailInfo({
    //       username: payload.username,
    //       id: payload.id,
    //     });
    //     newUserInfo.tokensInfo.setInitRFCookie(token); // Init refresh token
    //     this.userProfiles.set(keyUser, newUserInfo);
    //   } 
    //   return true;
    // }
    // /** Update user profile based on the decoded token */
    // setUserProfile(userInfo: any, token: string): boolean {
    //   const payload = this.decodeToken(token);
    //   if (!payload) {
    //     console.warn("No token found, cannot set user profile.");
    //     return false;
    //   }
    //   const keyUser = payload.id || payload.username;
    //   if (!keyUser) {
    //     console.warn("No valid identifier found in token.");
    //     return false;
    //   }
  
    //   if (!this.userProfiles.has(keyUser)) {
    //     return false;
    //   } 
    //   let toBeUpdatedProfile: UserDetailInfo = this.userProfiles.get(keyUser) as UserDetailInfo;
    //   toBeUpdatedProfile.setInfo(userInfo);
    //   return true;
    // }
  
    // /** Retrieve the user profile based on the decoded token */
    // getUserProfile(token: string | null): UserDetailInfo | undefined {
    //   if (!token) return undefined;
  
    //   const userIdentity = this.decodeToken(token);
    //   if (!userIdentity) return undefined;
  
    //   const userId = userIdentity.id || userIdentity.username;
    //   return this.userProfiles.get(userId);
    // }
  
    // /** Remove a user profile when needed */
    // removeUserProfile(token: string): boolean {
    //   if (!token) return false;
  
    //   const userIdentity = this.decodeToken(token);
    //   if (!userIdentity) return false;
  
    //   const userId = userIdentity.id || userIdentity.username;
    //   this.userProfiles.delete(userId);
    //   return true;
    // }
}