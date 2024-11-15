export interface APIResponseUser {
  id: string;
  fullName: string;
  username: string;
  profilePicture?: string;
}

export interface ChatUser extends APIResponseUser {
  profilePictureURL: string;
}

export type AuthUser = APIResponseUser | null;

