import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getShiftPlan({ queryKey }) {
  console.log("getShiftPlan");
  //TODO: Отримуємо параметри з queryKey
  const [_, { date, shift }] = queryKey;
  console.log("getShiftPlan params", date, shift);
  const res = await secureFetch(`${API_URL}/api/shift_supervisor/shift_plan?input_date=${date}&shift=${shift}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("shift plan res", res);
  if (!res.ok) throw new Error("Failed to fetch shift plan");
  const data = await res.json();
  // console.log("shift plan data", data);

  // const id = data.map((data) => [
  //   data.turnaround.arrived_date,
  //   data.turnaround.arrived_flight_name,
  //   data.turnaround.aircraft,
  //   data.turnaround.next_departure_flight_name,
  // ]);
  // console.log("packages", id);

  return data;
}

export default getShiftPlan;
