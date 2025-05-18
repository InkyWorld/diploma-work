import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getAllWorkers() {
  console.log("getAllWorkers");
  const res = await secureFetch(`${API_URL}/api/shift_supervisor/get_all_workers`);
  console.log("workers res", res);
  if (!res.ok) throw new Error("Failed to fetch all workers");
  const data = await res.json();
  console.log("workers", data);

  return data;
}

export default getAllWorkers;
