import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getFlights({ queryKey }) {
  console.log("getFlights");
  //TODO: Отримуємо параметри з queryKey
  const [_, { start_date, end_date, transit }] = queryKey;
  console.log("getFlights params", start_date, end_date, transit);
  const res = await secureFetch(
    `${API_URL}/api/flight_dispatcher/flights_arrival?start_date=${start_date}&end_date=${end_date}&transit=${transit}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("fligths res", res);
  if (!res.ok) throw new Error("Failed to fetch flights");
  const data = await res.json();
  console.log("flights data", data);
  return data;
}

export default getFlights;
