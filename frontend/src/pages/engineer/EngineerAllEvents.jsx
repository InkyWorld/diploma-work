import { useQuery } from "@tanstack/react-query";
import getEventsReport from "../../services/engineer/getEventsReport";
import Loader from "../../components/Loader";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventsFiltersForm from "../../features/engineer/EventsFiltersForm";
import SearchResultTitle from "../../features/engineer/SearchResultTitle";
import ButtonBack from "../../components/ButtonBack";

const examplePackages = [
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
];

const DEFAULT_EVENT_PARAMS = {
  aircraftCode: "",
  packageId: "",
  eventId: "",
};

function EngineerAllEvents() {
  const [searchParams, setSearchParams] = useSearchParams();

  //TODO: Зчитуємо з URL або дефолт
  const getInitialParams = () => ({
    aircraftCode: searchParams.get("aircraftCode") || DEFAULT_EVENT_PARAMS.aircraftCode,
    packageId: searchParams.get("packageId") || DEFAULT_EVENT_PARAMS.packageId,
    eventId: searchParams.get("eventId") || DEFAULT_EVENT_PARAMS.eventId,
  });

  const [queryParams, setQueryParams] = useState(getInitialParams);

  //TODO: Якщо параметри у URL змінюються — оновлюємо стейт
  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  console.log("Current params", queryParams);

  const { data, isLoading } = useQuery({
    queryKey: ["events", queryParams],
    queryFn: getEventsReport,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 10, // 10 хвилин у кеші
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ButtonBack url="/engineer" />
      {/* <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-800">Всі завдання</h1>
        <p className="text-gray-600 mt-2">Інформація про всі завдання у пакетах</p>
      </div> */}

      <h2 className="text-xl font-bold text-gray-800 my-4">Фільтри (отримання конкретних завдань):</h2>
      <EventsFiltersForm isLoading={isLoading} currentParams={queryParams} setQueryParams={setQueryParams} />

      <h2 className="text-xl font-bold text-gray-800 my-4">
        <SearchResultTitle queryParams={queryParams} />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-8">
            Немає результатів за заданими фільтрами.
          </div>
        ) : (
          data.map((pkg) => (
            <div key={pkg.event_performance_number_identifier} className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-800">#{pkg.event_performance_number_identifier}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="italic font-semibold">Належить пакету:</span> {pkg.work_package_number}
                </p>
                <p>
                  <span className="italic font-semibold">Ідентифікатор пакета: </span>
                  {pkg.work_package_number_identifier}
                </p>
                <p>
                  <span className="italic font-semibold">Код літака:</span> {pkg.aircraft_code}
                </p>
                <p>
                  <span className="italic font-semibold">Код події:</span> {pkg.event_code}
                </p>
                <p>
                  <span className="italic font-semibold">Оцінка годин:</span> {pkg.estimated_man_hours}
                </p>
                <p>
                  <span className="italic font-semibold">Статус:</span> {pkg.status}
                </p>
                <p>
                  <span className="italic font-semibold">Опис події:</span>
                  <br />
                  {pkg.event_display_description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EngineerAllEvents;
