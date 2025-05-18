import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const testShiftData = [
  {
    turnaround: {
      aircraft: "PSK",
      arrived_date: "2019-06-03",
      arrived_time: "01:05:00",
      arrived_flight_name: "PS 5331",
      next_departure_date: null,
      next_departure_time: null,
      next_departure_flight_name: null,
      departure_within_shift: false,
      arrived_within_shift: false,
    },
    work_package: [
      {
        package_number_internal: "74839",
        package_number: "PSK/L-310521-2",
        start_date: "2019-06-02",
        start_time: "22:41:00",
        end_date: "2019-06-03",
        end_time: "00:41:00",
        description: "AA+BD+48",
        status: 0,
        events: [
          {
            event_performance_number_identifier: 3505772,
            estimated_man_hours: 0,
            event_code: "024147-000",
            event_display_description: "REPLACE 024147-000/09052002152B8/W3505772 (AIRCRAFT BATTERY)",
            status: "N",
            completed: false,
          },
          {
            event_performance_number_identifier: 3505779,
            estimated_man_hours: 0,
            event_code: "024147-000",
            event_display_description: "REPLACE 024147-000/090520009E7DD/W3505779 (AIRCRAFT BATTERY)",
            status: "N",
            completed: false,
          },
          {
            event_performance_number_identifier: 8147017,
            estimated_man_hours: 0,
            event_code: "8147017",
            event_display_description:
              "8147017/AFTER ARRIVAL PERFORM AFTER ARRIVAL WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
            status: "N",
            completed: false,
          },
          {
            event_performance_number_identifier: 8147021,
            estimated_man_hours: 0,
            event_code: "8147021",
            event_display_description:
              "8147021/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
            status: "N",
            completed: false,
          },
          {
            event_performance_number_identifier: 8147030,
            estimated_man_hours: 0,
            event_code: "8147030",
            event_display_description: "8147030/PERFORM 48 HRS CHECK.",
            status: "N",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    turnaround: {
      aircraft: "PSY",
      arrived_date: "2019-06-03",
      arrived_time: "01:10:00",
      arrived_flight_name: "PS 6239",
      next_departure_date: null,
      next_departure_time: null,
      next_departure_flight_name: null,
      departure_within_shift: false,
      arrived_within_shift: false,
    },
    work_package: [
      {
        package_number_internal: "74831",
        package_number: "PSY/L-310521-5",
        start_date: "2019-06-02",
        start_time: "23:00:00",
        end_date: "2019-06-03",
        end_time: "00:00:00",
        description: "BD",
        status: 0,
        events: [
          {
            event_performance_number_identifier: 8147028,
            estimated_man_hours: 0,
            event_code: "8147028",
            event_display_description:
              "8147028/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
            status: "N",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    turnaround: {
      aircraft: "PSP",
      arrived_date: "2019-06-03",
      arrived_time: "01:25:00",
      arrived_flight_name: "PS 7015",
      next_departure_date: null,
      next_departure_time: null,
      next_departure_flight_name: null,
      departure_within_shift: false,
      arrived_within_shift: false,
    },
    work_package: [
      {
        package_number_internal: "74830",
        package_number: "PSP/L-310521-3",
        start_date: "2019-06-02",
        start_time: "23:00:00",
        end_date: "2019-06-03",
        end_time: "00:00:00",
        description: "BD",
        status: 0,
        events: [
          {
            event_performance_number_identifier: 8147025,
            estimated_man_hours: 0,
            event_code: "8147025",
            event_display_description:
              "8147025/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
            status: "N",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    turnaround: {
      aircraft: "PSZ",
      arrived_date: "2019-06-03",
      arrived_time: "01:30:00",
      arrived_flight_name: "PS 6233",
      next_departure_date: null,
      next_departure_time: null,
      next_departure_flight_name: null,
      departure_within_shift: false,
      arrived_within_shift: false,
    },
    work_package: [
      {
        package_number_internal: "74832",
        package_number: "PSZ/L-310521-3",
        start_date: "2019-06-02",
        start_time: "23:01:00",
        end_date: "2019-06-03",
        end_time: "01:01:00",
        description: "BD+48",
        status: 0,
        events: [
          {
            event_performance_number_identifier: 8147027,
            estimated_man_hours: 0,
            event_code: "8147027",
            event_display_description:
              "8147027/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
            status: "N",
            completed: false,
          },
          {
            event_performance_number_identifier: 8147033,
            estimated_man_hours: 0,
            event_code: "8147033",
            event_display_description:
              "8147033/PERFORM 48 HRS CHECK. INSPECT I.A.W. DMI#DMI#072314/1 (WO#8106997) INSPECT I.A.W. DMI#DMI#0067...",
            status: "N",
            completed: false,
          },
        ],
      },
    ],
  },
];

export default function ShiftPlanSection({ shiftType, date }) {
  const [shiftData, setShiftData] = useState(testShiftData);
  const navigate = useNavigate(); // 🔹

  const getSituationDescription = (turnaround) => {
    const { arrived_within_shift, departure_within_shift } = turnaround;

    if (arrived_within_shift && departure_within_shift) {
      return "Прибуття і виліт відбулися під час зміни";
    }
    if (arrived_within_shift && !departure_within_shift) {
      return "Прибуття під час зміни, виліт поза зміною або відсутній";
    }
    if (!arrived_within_shift && departure_within_shift) {
      return "Прибуття поза зміною або відсутнє, виліт під час зміни";
    }
    if (!arrived_within_shift && !departure_within_shift) {
      return "Прибуття і виліт поза зміною або відсутні";
    }
    return "Невідома ситуація";
  };
  // useEffect(() => {
  //   getShiftPlan(shiftType, date).then(setShiftData);
  // }, [shiftType, date]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📋 План зміни</h2>

      {shiftData.length === 0 ? (
        <p className="text-gray-500">Дані відсутні.</p>
      ) : (
        shiftData.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 mb-6 bg-white shadow-md">
            <h3 className="text-lg font-bold mb-2">✈️ Літак: {item.turnaround.aircraft}</h3>
            <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Прибуття:</strong>{" "}
                {item.turnaround.arrived_date ? `${item.turnaround.arrived_date} ${item.turnaround.arrived_time}` : "—"}
              </p>
              <p>
                <strong>Рейс прибуття:</strong> {item.turnaround.arrived_flight_name || "—"}
              </p>
              <p>
                <strong>Відправлення:</strong>{" "}
                {item.turnaround.next_departure_date
                  ? `${item.turnaround.next_departure_date} ${item.turnaround.next_departure_time}`
                  : "—"}
              </p>
              <p>
                <strong>Рейс відправлення:</strong> {item.turnaround.next_departure_flight_name || "—"}
              </p>
              <p>
                <strong>Прибуття у зміну:</strong> {item.turnaround.arrived_within_shift ? "Так" : "Ні"}
              </p>
              <p>
                <strong>Відправлення у зміну:</strong> {item.turnaround.departure_within_shift ? "Так" : "Ні"}
              </p>
            </div>

            <div className="bg-yellow-100 text-sm text-gray-800 p-2 rounded">
              <p>
                <strong>Ситуація:</strong> {getSituationDescription(item.turnaround)}
              </p>
            </div>
            {/* <h3 className="text-lg font-bold mb-2">✈️ Літак: {item.turnaround.aircraft}</h3>
            <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Прибуття:</strong> {item.turnaround.arrived_date} {item.turnaround.arrived_time}
              </p>
              <p>
                <strong>Рейс прибуття:</strong> {item.turnaround.arrived_flight_name}
              </p>
              <p>
                <strong>Відправлення:</strong> {item.turnaround.next_departure_date}{" "}
                {item.turnaround.next_departure_time}
              </p>
              <p>
                <strong>Рейс відправлення:</strong> {item.turnaround.next_departure_flight_name}
              </p>
              <p>
                <strong>Прибуття у зміну:</strong> {item.turnaround.arrived_within_shift ? "Так" : "Ні"}
              </p>
              <p>
                <strong>Відправлення у зміну:</strong> {item.turnaround.departure_within_shift ? "Так" : "Ні"}
              </p>
            </div> */}

            {item.work_package.map((pkg) => (
              <div key={pkg.package_number_internal} className="mt-4 border-t pt-3">
                <h4 className="text-md font-semibold mb-1">📦 Пакет: {pkg.package_number}</h4>
                <p>
                  <strong>ID пакета:</strong> {pkg.package_number_internal}
                </p>
                <p>
                  <strong>Опис:</strong> {pkg.description}
                </p>
                <p>
                  <strong>Початок:</strong> {pkg.start_date} {pkg.start_time}
                </p>
                <p>
                  <strong>Завершення:</strong> {pkg.end_date} {pkg.end_time}
                </p>
                <p>
                  <strong>Статус:</strong> {pkg.status}
                </p>

                <div className="mt-2 ml-4">
                  <p className="font-medium">Події:</p>
                  {pkg.events.map((event) => (
                    <div key={event.event_performance_number_identifier} className="bg-gray-100 p-3 rounded-md mb-3">
                      <p>
                        <strong>Код події:</strong> {event.event_code}
                      </p>
                      <p>
                        <strong>ID виконання:</strong> {event.event_performance_number_identifier}
                      </p>
                      <p>
                        <strong>Опис:</strong> {event.event_display_description}
                      </p>
                      <p>
                        <strong>Оцінка людино-годин:</strong> {event.estimated_man_hours}
                      </p>
                      <p>
                        <strong>Статус:</strong> {event.status}
                      </p>
                      <p>
                        <strong>Виконано:</strong> {event.completed ? "✅ Так" : "⏳ Ні"}
                      </p>

                      {/* 🔹 Кнопка переходу */}
                      {/* <button
                        onClick={() => navigate(`/tasks/${event.event_performance_number_identifier}`)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Деталі завдання
                      </button> */}
                      <Link
                        to={`assign-tasks/${event.event_performance_number_identifier}`}
                        className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Призначити працівників
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
