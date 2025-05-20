import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import getPackages from "../../services/engineer/getPackages";
import PackagesFiltersForm from "../../features/engineer/PackagesFiltersForm";

const exampleRackages = [
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
];

const DEFAULT_PACKAGES_PARAMS = {
  aircraftCode: "",
  packageId: "",
  station: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

function EngineerPackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  //TODO: Зчитуємо з URL або дефолт
  const getInitialParams = () => ({
    aircraftCode: searchParams.get("aircraftCode") || DEFAULT_PACKAGES_PARAMS.aircraftCode,
    packageId: searchParams.get("packageId") || DEFAULT_PACKAGES_PARAMS.packageId,
    station: searchParams.get("station") || DEFAULT_PACKAGES_PARAMS.station,
    startDate: searchParams.get("startDate") || DEFAULT_PACKAGES_PARAMS.startDate,
    startTime: searchParams.get("startTime") || DEFAULT_PACKAGES_PARAMS.startTime,
    endDate: searchParams.get("endDate") || DEFAULT_PACKAGES_PARAMS.endDate,
    endTime: searchParams.get("endTime") || DEFAULT_PACKAGES_PARAMS.endTime,
  });

  const [queryParams, setQueryParams] = useState(getInitialParams);

  //TODO: Якщо параметри у URL змінюються — оновлюємо стейт
  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  console.log("Current params", queryParams);

  const { data, isLoading } = useQuery({
    queryKey: ["packages", queryParams],
    queryFn: getPackages,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 10, // 10 хвилин у кеші
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap gap-4 mb-8 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Панель інженера</h1>
          <p className="text-gray-600 mt-2">Перегляд робочих пакетів</p>
        </div>

        <Link
          to="eventsAll"
          className="flex items-center self-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-md px-6 py-3 rounded-xl shadow-md transition"
        >
          Переглянути всі завдання
        </Link>
      </div>

      <h2 className="text-xl font-bold text-gray-800 my-4">Фільтри (отримання конкретних пакетів):</h2>
      <PackagesFiltersForm isLoading={isLoading} currentParams={queryParams} setQueryParams={setQueryParams} />

      <h2 className="text-xl font-bold text-gray-800 my-4">Результати:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((pkg) => (
          <div
            key={pkg.package_number_internal}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-600 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-2">{pkg.package_number}</h2>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Ідентифікатор пакета:</span> {pkg.package_number_internal}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Код літака:</span> {pkg.aircraft_registration}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Аеропорт:</span> {pkg.station}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Початок робіт:</span> {pkg.start_date}{" "}
              {pkg.start_time.slice(0, -3)}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Завершення:</span> {pkg.end_date} {pkg.end_time.slice(0, -3)}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Статус:</span> {pkg.status}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold italic">Опис:</span> {pkg.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EngineerPackagesPage;
