import { api } from "../main";

export async function getProfilePicURL(id: string) {
  const res = await api.get(
    `/api/users/profile-picture/${id}`,
    {
      responseType: "blob",
    }
  );
  return URL.createObjectURL(res.data);
}
