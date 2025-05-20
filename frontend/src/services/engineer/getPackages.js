import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getPackages({ queryKey }) {
  console.log("getPackages");
  const [_, { aircraftCode, packageId, station, startDate, startTime, endDate, endTime }] = queryKey;
  let url = "api/engineer/packages";
  const params = [];

  if (packageId) {
    params.push(`package_number_internal=${packageId}`);
  }
  if (aircraftCode) {
    params.push(`aircraft_registration=${aircraftCode}`);
  }
  if (station) {
    params.push(`station=${station}`);
  }
  if (startDate) {
    params.push(`start_date=${startDate}`);
  }
  if (startTime) {
    params.push(`start_time=${startTime}`);
  }
  if (endDate) {
    params.push(`end_date=${endDate}`);
  }
  if (endTime) {
    params.push(`end_time=${endTime}`);
  }

  if (params.length > 0) {
    url += "?" + params.join("&");
  }

  console.log(`FINAL URL: ${API_URL}/${url}`);

  const response = await secureFetch(`${API_URL}/${url}`);

  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

  const data = await response.json();
  console.log("PACKAGES", data);
  return data;
}
export default getPackages;
