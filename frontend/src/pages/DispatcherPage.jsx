import { format, parseISO, differenceInMinutes } from "date-fns";

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

const DispatcherDashboard = () => {
  const now = new Date();
  const totalFlights = testFlights.length;
  const incompleteMaintenance = testFlights.filter((f) => f.status === "awaiting_maintenance").length;
  const upcomingFlights = testFlights
    .filter((f) => new Date(f.departure) > now)
    .sort((a, b) => new Date(a.departure) - new Date(b.departure));

  const maintenanceDelays = testFlights.filter((f) => f.status === "awaiting_maintenance").length;
  const averageMaintenanceTime = 120; // хвилин, умовно

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Панель диспетчера</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-gray-600">✈️ Загальна кількість рейсів</div>
          <div className="text-2xl font-bold">{totalFlights}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-gray-600">🚧 Незавершене ТО</div>
          <div className="text-2xl font-bold">{incompleteMaintenance}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-gray-600">📆 Ближчий рейс</div>
          <div className="text-lg">
            {upcomingFlights[0]
              ? `${upcomingFlights[0].flight_number} — ${format(
                  parseISO(upcomingFlights[0].departure),
                  "dd.MM.yyyy HH:mm"
                )}`
              : "Немає"}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-gray-600">📈 Статистика по ТО</div>
          <div className="text-sm">
            Середній час: {averageMaintenanceTime} хв
            <br />
            Затримки: {maintenanceDelays}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Таблиця рейсів</h2>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">#</th>
              <th className="p-2">Рейс</th>
              <th className="p-2">Літак</th>
              <th className="p-2">Виліт</th>
              <th className="p-2">Статус</th>
              <th className="p-2">Останнє ТО</th>
            </tr>
          </thead>
          <tbody>
            {testFlights.map((flight) => (
              <tr key={flight.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{flight.id}</td>
                <td className="p-2">{flight.flight_number}</td>
                <td className="p-2">{flight.aircraft}</td>
                <td className="p-2">{format(parseISO(flight.departure), "dd.MM.yyyy HH:mm")}</td>
                <td className="p-2">
                  {flight.status === "awaiting_maintenance" ? (
                    <span className="text-yellow-600">Очікує ТО</span>
                  ) : (
                    <span className="text-green-600">OK</span>
                  )}
                </td>
                <td className="p-2">
                  {flight.maintenance_history.length > 0
                    ? `${flight.maintenance_history[0].type} — ${flight.maintenance_history[0].date}`
                    : "Немає"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DispatcherDashboard;
