import API_URL from "../../config";

async function addUser(form, accessToken) {
  console.log("add user", form);

  const formData = new FormData();
  formData.append("username", form.username);
  formData.append("password", form.password);
  formData.append("full_name", form.full_name);
  formData.append("role", form.role);
  formData.append("age", form.age);
  formData.append("gender", form.gender);
  if (form.img_profile) {
    formData.append("img_profile", form.img_profile);
  }

  const res = await fetch(`${API_URL}/api/admin/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  console.log(res);
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Користувач з таким email вже існує.");
    } else throw new Error("Could not create user");
  }
  const data = await res.json();
  console.log("result", data);
  return data;
}
export default addUser;
