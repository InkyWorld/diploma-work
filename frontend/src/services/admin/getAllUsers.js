import API_URL from "../../config";

async function getAllUsers(accessToken) {
  console.log("getAllUsers");
  const res = await fetch(`${API_URL}/api/admin/all_users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  console.log(data);
  return data;
}

// async function getAllUsers() {
//   try {
//     setIsLoading(true);
//     setError(false);
//     console.log("fetch");
//     const res = await fetch(`${API_URL}/api/admin/all_users`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log(res);
//     if (!res.ok) throw new Error("Failed to fetch");
//     const data = await res.json();
//     console.log(data);
//     setData(data);
//   } catch (error) {
//     console.log(error.message);
//     setError(error.message);
//   } finally {
//     setIsLoading(false);
//   }
// }
export default getAllUsers;
