import axios from "axios";

export async function getProfilePicURL(id: string) {
  const res = await axios.get(
    `http://localhost:3000/api/users/profile-picture/${id}`,
    {
      responseType: "blob",
      withCredentials: true,
    }
  );
  return URL.createObjectURL(res.data);
}
