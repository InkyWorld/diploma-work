import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function markTaskDone(taskId, shift) {
  console.log("markTaskDone");
  console.log("markTaskDone params", taskId, shift);

  const res = await secureFetch(
    `${API_URL}/api/technician/mark_work_done?event_performance_number_identifier=${taskId}&shift=${shift}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("markTaskDone res", res);
  if (!res.ok) throw new Error("Failed to mark task done");
  const data = await res.json();
  console.log("markTaskDone data", data);
  return "TASK DONE";
}

export default markTaskDone;
