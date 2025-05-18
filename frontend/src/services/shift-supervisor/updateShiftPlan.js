import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function updateShiftPlan(queryParams) {
  console.log("updateShiftPlan");
  const { date, shift } = queryParams;
  console.log("updateShiftPlan params", date, shift);
  const res = await secureFetch(`${API_URL}/api/shift_supervisor/update_shift_plan?input_date=${date}&shift=${shift}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("update shift plan res", res);
  if (!res.ok) throw new Error("Failed to update shift plan");
  const data = await res.json();
  console.log("shift plan data", data);
  const id = data.map((data) => [
    data.turnaround.arrived_date,
    data.turnaround.arrived_flight_name,
    data.turnaround.aircraft,
    data.turnaround.next_departure_flight_name,
  ]);
  console.log("packages", id);
  console.log(data);

  return data;
}

export default updateShiftPlan;
