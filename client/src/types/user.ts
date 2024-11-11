export interface APIResponseUser {
  id: string;
  fullName: string;
  username: string;
  profilePicture?: string;
}

export type AuthUser = APIResponseUser | null;
