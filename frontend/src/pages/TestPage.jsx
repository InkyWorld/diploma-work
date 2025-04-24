import Table from "../components/Table";

function getStatusColor(status) {
  switch (status) {
    case "ok":
      return "text-green-600 bg-green-100";
    case "awaiting_maintenance":
      return "text-yellow-700 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

const testFlights = [
  {
    id: 401,
    flight_number: "PS101",
    aircraft: "Boeing 737",
    departure: "2025-04-22T08:00:00Z",
    status: "awaiting_maintenance",
    maintenance_history: [{ date: "2025-03-10", status: "done", type: "A-check" }],
  },
  {
    id: 402,
    flight_number: "AF244",
    aircraft: "Airbus A320",
    departure: "2025-04-24T14:00:00Z",
    status: "ok",
    maintenance_history: [{ date: "2025-04-01", status: "done", type: "B-check" }],
  },
];

const flightFields = ["flight_number", "aircraft", "departure", "status", "maintenance_history"];

function TestPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Flight Overview</h1>
      <Table columns={flightFields}>
        {testFlights.map((flight) => (
          <tr key={flight.id} className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4">{flight.flight_number}</td>
            <td className="px-6 py-4">{flight.aircraft}</td>
            <td className="px-6 py-4 text-gray-700">{new Date(flight.departure).toLocaleString()}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                {flight.status.replace(/_/g, " ")}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{flight.maintenance_history?.[0]?.type || "—"}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default TestPage;
