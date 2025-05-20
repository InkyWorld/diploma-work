import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import getFlights from "../../services/dispatcher/getFlights";
import FlightsForm from "../../features/dispatcher/FlightsForm";
import { useSearchParams } from "react-router-dom";
import DispatcherPageFilters, { filterData } from "../../features/dispatcher/DispatcherPageFilters";

const DEFAULT_FLIGHTS_PARAMS = {
  start_date: "2019-06-03",
  end_date: "2019-06-03",
  transit: "arrival",
  filter: "all",
};

function DispatcherDataPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  //TODO: Зчитуємо з URL або дефолт
  const getInitialParams = () => ({
    start_date: searchParams.get("start_date") || DEFAULT_FLIGHTS_PARAMS.start_date,
    end_date: searchParams.get("end_date") || DEFAULT_FLIGHTS_PARAMS.end_date,
    transit: searchParams.get("transit") || DEFAULT_FLIGHTS_PARAMS.transit,
    filter: searchParams.get("filter") || DEFAULT_FLIGHTS_PARAMS.filter,
  });

  const [queryParams, setQueryParams] = useState(getInitialParams);

  //TODO: Якщо параметри у URL змінюються — оновлюємо стейт
  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  // console.log("Current params", queryParams);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["flights", queryParams],
    queryFn: getFlights,
  });

  const handleFilterChange = (filter) => {
    setQueryParams((prev) => ({ ...prev, filter }));
  };

  if (isError) return <ErrorMessage message={error.message} onRetry={refetch} />;
  if (isLoading || !data) return <Loader />;

  const filteredData = filterData(data, queryParams.filter);
  console.log("filtered flights", filteredData);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Панель диспетчера</h1>
        <p className="text-gray-600 mt-2">Перегляд рейсів, фільтрація за датами та типом рейсу</p>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm pb-6 md:pb-0 mx-auto overflow-hidden">
        <h2 className="w-full text-center text-gray-600 font-semibold mb-4 lg:text-left bg-gray-200 px-6 py-3">
          Пошук рейсів за періодом
        </h2>
        <FlightsForm isLoading={isLoading} setQueryParams={setQueryParams} />
      </div>

      {/* Фільтрація таблиці */}
      <DispatcherPageFilters queryParams={queryParams} handleFilterChange={handleFilterChange} />

      {/* Таблиця з даними */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-center text-gray-600 font-semibold ">Літак</th>
              <th className="p-3 text-center text-gray-600 font-semibold whitespace-nowrap">№ рейсу</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Клас</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Куди (приб.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Дата (приб.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Час (приб.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Куди (відпр.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Дата (відпр.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Час (відпр.)</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b-2 border-gray-200 last:border-none">
                <td className="p-3 text-center">{item.aircraft_name}</td>
                <td className="p-3 text-center">{item.flight_name}</td>
                <td className="p-3 text-center">{item.service_class}</td>
                <td className="p-3 text-center">{item.arrival_airport}</td>
                <td className="p-3 text-center">{item.arrival_date}</td>
                <td className="p-3 text-center">{item.arrival_time.slice(0, -3)}</td>
                <td className="p-3 text-center">{item.departure_airport}</td>
                <td className="p-3 text-center">{item.departure_date}</td>
                <td className="p-3 text-center">{item.departure_time.slice(0, -3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DispatcherDataPage;
