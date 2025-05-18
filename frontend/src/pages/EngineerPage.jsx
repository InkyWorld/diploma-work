// function EngineerPage() {
//   return <div>EngineerPage page</div>;
// }

// export default EngineerPage;

const testData = [
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
];

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

// const testData = [
//   {
//     id: 101,
//     title: "ТО Boeing 737",
//     aircraft: "Boeing 737",
//     status: "pending",
//     created_at: "2025-04-20",
//     tasks: [
//       { id: 1, description: "Перевірка шасі", duration: "2h" },
//       { id: 2, description: "Огляд двигуна", duration: "3h" },
//     ],
//   },
//   {
//     id: 102,
//     title: "ТО Airbus A320",
//     aircraft: "Airbus A320",
//     status: "in_progress",
//     created_at: "2025-04-18",
//     tasks: [{ id: 3, description: "Перевірка гальм", duration: "1.5h" }],
//   },
//   {
//     id: 103,
//     title: "ТО Airbus A330",
//     aircraft: "Airbus A330",
//     status: "in_progress",
//     created_at: "2025-04-18",
//     tasks: [{ id: 3, description: "Перевірка гальм", duration: "1.5h" }],
//   },
//   {
//     id: 104,
//     title: "ТО Airbus A330",
//     aircraft: "Airbus A330",
//     status: "in_progress",
//     created_at: "2025-04-18",
//     tasks: [{ id: 3, description: "Перевірка гальм", duration: "1.5h" }],
//   },
// ];

const EngineerDashboard = () => {
  const total = testData.length;
  const pending = testData.filter((p) => p.status === "pending").length;
  const inProgress = testData.filter((p) => p.status === "in_progress").length;
  const completed = testData.filter((p) => p.status === "completed").length;

  const statusLabel = {
    pending: "Очікує",
    in_progress: "В роботі",
    completed: "Завершено",
  };

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-4">📊 Огляд технічного стану</h1>

      {/* Статистика */}
      <div className="flex flex-wrap mb-8">
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-blue-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">📦 Всього:</h2>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-yellow-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">⏱ Очікує:</h2>
            <p className="text-2xl font-bold">{pending}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-green-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">⚙️ В роботі:</h2>
            <p className="text-2xl font-bold">{inProgress}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-gray-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">✅ Завершено:</h2>
            <p className="text-2xl font-bold">{completed}</p>
          </div>
        </div>
      </div>

      {/* Список пакетів */}
      <h2 className="text-2xl font-bold mb-4">📋 Список пакетів</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.package_number_internal}
            className="bg-blue-100 rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-semibold">{pkg.package_number}</h3>
                <p className="text-sm text-gray-600">
                  Літак: {pkg.aircraft_registration} | Станція: {pkg.station}
                </p>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-200">
                {pkg.status === 0 ? "Новий" : "Інший статус"}
              </span>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Опис:</h4>
              <p className="text-sm">{pkg.description}</p>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Час виконання:</h4>
              <p className="text-sm">
                {pkg.start_date} {pkg.start_time} - {pkg.end_date} {pkg.end_time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Список пакетів */}
      <h2 className="text-2xl font-bold mb-4">📋 Список пакетів</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testData.map((pkg) => (
          <div
            key={pkg.event_performance_number_identifier}
            className="bg-blue-100 rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-semibold">{pkg.work_package_number}</h3>
                <p className="text-sm text-gray-600">
                  Літак: {pkg.aircraft_code} | Код події: {pkg.event_code}
                </p>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-200">
                {pkg.status === "N" ? "Новий" : "Інший статус"}
              </span>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Опис події:</h4>
              <p className="text-sm">{pkg.event_display_description}</p>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Оцінка годин:</h4>
              <p className="text-sm">{pkg.estimated_man_hours} год.</p>
            </div>
            {/* Кнопка переходу до детального перегляду */}
            {/* <div className="mt-4 text-right">
              <button className="text-blue-600 hover:underline text-sm">Детальніше →</button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineerDashboard;
