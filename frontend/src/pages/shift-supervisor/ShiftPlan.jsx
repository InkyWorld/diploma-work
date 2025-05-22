import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShiftPlan } from "../../redux/slices/supervisorSlice";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getShiftPlan from "../../services/shift-supervisor/getShiftPlan";
import Loader from "../../components/Loader";
import ShiftPlanForm from "../../features/shift-supervisor/ShiftPlanForm";
import updateShiftPlan from "../../services/shift-supervisor/updateShiftPlan";

const testShiftData = [
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
        ],
      },
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

function createKey([arrived_date, arrivedFlight, station, departureFlight]) {
  return `${arrived_date}|${arrivedFlight}|${station}|${departureFlight ?? "null"}`;
}

const DEFAULT_PARAMS = {
  date: "2019-06-03",
  shift: "day",
};

const ShiftPlan = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //TODO: Зчитуємо з URL або дефолт
  const getInitialParams = () => ({
    date: searchParams.get("date") || DEFAULT_PARAMS.date,
    shift: searchParams.get("shift") || DEFAULT_PARAMS.shift,
  });

  const [queryParams, setQueryParams] = useState(getInitialParams);

  //TODO: Якщо параметри у URL змінюються — оновлюємо стейт
  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  console.log("Current params", searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["shiftPlan", queryParams],
    queryFn: getShiftPlan,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 10, // 5 хвилин у кеші
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateShiftPlan,
    onSuccess: (response, formParams) => {
      console.log("Оновлено успішно:", response);
      console.log("Що передали в mutate:", formParams);
      queryClient.invalidateQueries({ queryKey: ["shiftPlan", formParams] });
    },
  });

  if (isLoading || isPending) return <Loader />;
  window.scrollTo({ top: 0, behavior: "smooth" });
  console.log("SHIFTPLAN", data);
  return (
    <div className="p-6 space-y-8 bg-gray-100">
      <h1 className="text-2xl font-bold">Головна сторінка бригадира</h1>
      <div>
        <div className="w-full mb-10 bg-white rounded-xl shadow-sm pb-6 md:pb-0 mx-auto overflow-hidden">
          <h2 className="w-full  text-gray-600 font-semibold mb-4 lg:text-left bg-gray-200 px-6 py-3">
            Shift plan за вказаний період (створення/оновлення)
          </h2>
          <ShiftPlanForm isLoading={false} setQueryParams={setQueryParams} isPending={isPending} updateData={mutate} />
        </div>

        <h2 className="text-2xl font-bold mb-6">
          Завдання на {queryParams.date}({queryParams.shift})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {testShiftData.map((item, index) => { */}
          {data.map((item, index) => {
            const turnaround = item.turnaround;
            const packages = item.work_package;
            return (
              <div
                key={index}
                className="flex flex-col bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Turnaround Info */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 ">Літак: {turnaround.aircraft}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Arrival Block */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Прибуття:</h3>
                      <p>Рейс: {turnaround.arrived_flight_name ?? "—"}</p>
                      <p>Дата: {turnaround.arrived_date ?? "—"}</p>
                      <p>Час: {turnaround.arrived_time ?? "—"}</p>
                    </div>

                    {/* Departure Block */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Відправлення:</h3>
                      <p>Рейс: {turnaround.next_departure_flight_name ?? "—"}</p>
                      <p>Дата: {turnaround.next_departure_date ?? "—"}</p>
                      <p>Час: {turnaround.next_departure_time ?? "—"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-700">Ситуація:</p>
                    {/* <p className="text-gray-600">{getSituationDescription(turnaround)}</p> */}
                    <p>Прибуття під час зміни: {turnaround.arrived_within_shift ? "Так" : "Ні"}</p>
                    <p>Виліт під час зміни: {turnaround.departure_within_shift ? "Так" : "Ні"}</p>
                  </div>
                </div>

                {/* Work Packages */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Пакети робіт:</h3>
                  {packages.map((pack, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded-md border border-gray-200 mb-2">
                      <p>Пакет №: {pack.package_number}</p>
                      <p>Дата завершення: {pack.end_date ?? "—"}</p>
                      <p>Час завершення: {pack.end_time ?? "—"}</p>
                      <p>Кількість завдань: {pack.events?.length ?? 0}</p>
                    </div>
                  ))}
                </div>

                {/* Detail Button */}
                <Link
                  to={{
                    pathname: `turnaround/${createKey([
                      turnaround.arrived_date,
                      turnaround.arrived_flight_name,
                      turnaround.aircraft,
                      turnaround.next_departure_flight_name,
                    ])}`,
                    search: `?${searchParams.toString()}`,
                  }}
                  className="mt-auto font-semibold block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Детальніше
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShiftPlan;
