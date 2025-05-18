import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function assignWorkersToTask(taskId, shift, workersIds) {
  console.log("assignWorkersToTask");
  console.log("assignWorkersToTask params", taskId, shift, workersIds);
  const res = await secureFetch(
    `${API_URL}/api/shift_supervisor/set_worker_on_event?shift=${shift}&event_performance_number_identifier=${taskId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workersIds),
    }
  );
  console.log("assignWorkersToTask res", res);
  if (!res.ok) throw new Error("Failed to assign workers to task");
  return "ASSIGGNED";
}

export default assignWorkersToTask;
