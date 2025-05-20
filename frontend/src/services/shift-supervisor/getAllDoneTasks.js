import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getAllDoneTasks({ queryKey }) {
  console.log("getAllDoneTasks");
  const [_, shift] = queryKey;
  console.log("getAllDoneTasks", shift);
  const res = await secureFetch(`${API_URL}/api/shift_supervisor/all_events_done?shift=${shift}`);
  console.log("Done tasks res", res);
  if (!res.ok) throw new Error("Failed to fetch all done tasks");
  const data = await res.json();
  console.log("Done tasks", data);
  return data;
}

export default getAllDoneTasks;
