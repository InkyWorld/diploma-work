import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getTasks() {
  console.log("getTasks");
  const res = await secureFetch(`${API_URL}/api/technician/get_events`);
  console.log("tasks res", res);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  console.log("tasks", data);

  return data;
}

export default getTasks;
