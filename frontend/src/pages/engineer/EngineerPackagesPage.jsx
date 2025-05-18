const packages = [
  {
    package_number_internal: "72148",
    package_number: "PSI/L W23.2021",
    aircraft_registration: "PSI",
    station: "KBP",
    start_date: "2019-06-02",
    start_time: "19:00:00",
    end_date: "2019-06-03",
    end_time: "05:00:00",
    description: "STANDARD WORKPACKAGE",
    status: 0,
  },
  {
    package_number_internal: "74864",
    package_number: "PSE/L-010621",
    aircraft_registration: "PSE",
    station: "KBP",
    start_date: "2019-06-03",
    start_time: "05:10:00",
    end_date: "2019-06-03",
    end_time: "06:10:00",
    description: "AA+BD",
    status: 0,
  },
  {
    package_number_internal: "71757",
    package_number: "PSM/L W22.2021 A/C WASH",
    aircraft_registration: "PSM",
    station: "KBP",
    start_date: "2019-06-03",
    start_time: "08:23:00",
    end_date: "2019-06-03",
    end_time: "17:31:00",
    description: "STANDARD WORKPACKAGE",
    status: 0,
  },
];

function EngineerPackagesPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Панель інженера</h1>
        <p className="text-gray-600 mt-2">Перегляд робочих пакетів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.package_number_internal}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow duration-300"
            style={{
              borderColor: pkg.status !== 0 ? "#34D399" : "#F87171", // Green for active, red for completed
            }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{pkg.package_number}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Бортовий номер:</strong> {pkg.aircraft_registration}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Місце перебування:</strong> {pkg.station}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Початок робіт:</strong> {pkg.start_date} {pkg.start_time.slice(0, -3)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Завершення:</strong> {pkg.end_date} {pkg.end_time.slice(0, -3)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Опис:</strong> {pkg.description}
            </p>
            <p
              className={`text-sm font-semibold mt-3 px-3 py-1 rounded-full inline-block ${
                pkg.status !== 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {pkg.status !== 0 ? "Завершений" : "Очікує"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EngineerPackagesPage;
