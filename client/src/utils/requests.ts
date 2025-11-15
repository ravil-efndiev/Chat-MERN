import { api } from "../main";
import { ChatUser } from "../types/user";

export async function getProfilePicURL(id: string) {
  const res = await api.get(`/api/users/profile-picture/${id}`, {
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
}

export async function getUserData(id: string): Promise<ChatUser> {
  const res = await api.get(`/api/users/get-by-id/${id}`);
  const userData = res.data.user;
  const pfpID = userData.profilePicture;
  const pfpURL = pfpID ? await getProfilePicURL(pfpID) : "";

  return {
    ...userData,
    profilePictureURL: pfpURL,
  };
}
