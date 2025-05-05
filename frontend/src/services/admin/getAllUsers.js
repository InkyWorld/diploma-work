import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getAllUsers() {
  console.log("getAllUsers");
  const res = await secureFetch(`${API_URL}/api/admin/all_users`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  console.log(data);
  return data;
}

// async function getAllUsers(accessToken) {
//   console.log("getAllUsers");
//   const res = await fetch(`${API_URL}/api/admin/all_users`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   console.log(res);
//   if (!res.ok) throw new Error("Failed to fetch");
//   const data = await res.json();
//   console.log(data);
//   return data;
// }

export default getAllUsers;
