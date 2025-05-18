const allPackages = [
  {
    aircraft_code: "PSF",
    event_code: "8147000",
    work_package_number_identifier: 74784,
    work_package_number: "PSF/L-310521-2",
    event_performance_number_identifier: 8147000,
    event_display_description: "8147000/PERFORM 48 HRS CHECK. ...",
    estimated_man_hours: 0,
    status: "N",
  },
  {
    aircraft_code: "PSO",
    event_code: "8147018",
    work_package_number_identifier: 74829,
    work_package_number: "PSO/L-310521-2",
    event_performance_number_identifier: 8147018,
    event_display_description: "8147018/AFTER ARRIVAL PERFORM AFTER ARRIVAL WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
    estimated_man_hours: 0,
    status: "N",
  },
  {
    aircraft_code: "PSO",
    event_code: "8147024",
    work_package_number_identifier: 74829,
    work_package_number: "PSO/L-310521-2",
    event_performance_number_identifier: 8147024,
    event_display_description:
      "8147024/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
    estimated_man_hours: 0,
    status: "N",
  },
  {
    aircraft_code: "PSO",
    event_code: "8147032",
    work_package_number_identifier: 74829,
    work_package_number: "PSO/L-310521-2",
    event_performance_number_identifier: 8147032,
    event_display_description: "8147032/PERFORM 48 HRS CHECK.",
    estimated_man_hours: 0,
    status: "N",
  },
];

function EngineerAllEvents() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Всі пакети</h1>
        <p className="text-gray-600 mt-2">Інформація про всі робочі пакети</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {allPackages.map((pkg) => (
          <div
            key={pkg.event_performance_number_identifier}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">{pkg.work_package_number}</h2>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  pkg.status === "N" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {pkg.status === "N" ? "Не виконано" : "Виконано"}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Код літака:</strong> {pkg.aircraft_code}
              </p>
              <p>
                <strong>Код події:</strong> {pkg.event_code}
              </p>
              <p>
                <strong>Опис події:</strong>
                <br />
                {pkg.event_display_description}
              </p>
              <p>
                <strong>Оцінка годин:</strong> {pkg.estimated_man_hours}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EngineerAllEvents;
