import API_URL from "../../config";
import secureFetch from "../../features/auth/secureFetch";

async function getEventsReport({ queryKey }) {
  // async function getEventsReport(aircraftCode = null, packageId = null, eventId = null) {
  console.log("getEventsReport");
  const [_, { aircraftCode, packageId, eventId }] = queryKey;
  console.log("getEventsReport params", aircraftCode, packageId, eventId);
  let url = "api/engineer/event_report";
  const params = [];

  if (aircraftCode) {
    console.log("current aircraft code", aircraftCode);
    params.push(`aircraft_code=${aircraftCode}`);
  }
  if (packageId) {
    params.push(`work_package_number_identifier=${packageId}`);
  }
  if (eventId) {
    params.push(`event_performance_number_identifier=${eventId}`);
  }

  if (params.length > 0) {
    url += "?" + params.join("&");
  }

  console.log(`FINAL URL: ${API_URL}/${url}`);

  const response = await secureFetch(`${API_URL}/${url}`);

  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

  const data = await response.json();
  console.log("EVENTS REPORT", data);
  return data;
}
export default getEventsReport;
