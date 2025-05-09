import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function updateUser(email, form) {
  console.log("update user", email, form);

  const formData = new FormData();
  if (form.email) formData.append("login", form.email);
  if (form.password) formData.append("password", form.password);
  if (form.full_name) formData.append("full_name", form.full_name);
  if (form.role) formData.append("role", form.role);
  if (form.age) formData.append("age", +form.age);
  if (form.gender) formData.append("gender", form.gender);
  if (form.img_profile) {
    formData.append("img_profile", form.img_profile[0]);
  }
  console.log(formData);

  const res = await secureFetch(`${API_URL}/api/admin/user?email=${email}`, {
    method: "PATCH",
    body: formData,
  });
  console.log(res);
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Користувач з таким email вже існує.");
    } else throw new Error("Could not update user");
  }
  const data = await res.json();
  console.log("result", data);
  return data;
}
export default updateUser;
