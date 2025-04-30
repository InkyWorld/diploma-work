import API_URL from "../../config";

async function deleteUser(email, accessToken) {
  console.log("deleteUser", email, accessToken);
  const res = await fetch(`${API_URL}/api/admin/user?email=${email}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log(res);
  if (!res.ok) throw new Error("Failed to delete user");
}
export default deleteUser;
