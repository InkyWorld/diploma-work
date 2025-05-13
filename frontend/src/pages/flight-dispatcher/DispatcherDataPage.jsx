import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import getFlights from "../../services/dispatcher/getFlights";
import FlightsForm from "../../features/dispatcher/FlightsForm";

// const testData = [
//   {
//     aircraft_name: "PSL",
//     flight_name: "PS 5102",
//     service_class: "C",
//     departure_airport: "HRG",
//     departure_date: "2019-06-03",
//     departure_time: "06:35:00",
//     arrival_airport: "KBP",
//     arrival_date: "2019-06-03",
//     arrival_time: "10:30:00",
//     field1: 0,
//     field2: 0,
//   },
// ];

function DispatcherDataPage() {
  const [queryParams, setQueryParams] = useState({
    start_date: "2019-06-03",
    end_date: "2019-06-03",
    transit: "arrival",
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["flights", queryParams],
    queryFn: getFlights,
    retry: false,
    // staleTime: 60000, // 1 хвилина
    // refetchOnWindowFocus: false,
  });

  if (isError) return <ErrorMessage message={error.message} onRetry={refetch} />;
  if (isLoading || !data) return <Loader />;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Панель диспетчера</h1>
        <p className="text-gray-600 mt-2">Перегляд рейсів, фільтрація за датами та типом рейсу</p>
      </div>
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Сторінка Диспетчера</h1> */}

      <div className="w-full bg-white rounded-xl shadow-sm pb-6 md:pb-0 mx-auto overflow-hidden">
        <h2 className="w-full text-center text-gray-600 font-semibold mb-4 lg:text-left bg-gray-200 px-6 py-3">
          Пошук рейсів за періодом
        </h2>
        <FlightsForm isLoading={isLoading} setQueryParams={setQueryParams} />
      </div>

      {/* Фільтрація таблиці */}
      <div className="flex flex-wrap gap-3 my-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 text-sm">Усі</button>
        <button className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 text-sm">Відправлення</button>
        <button className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 text-sm">Прибуття</button>
      </div>

      {/* Таблиця з даними */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-center text-gray-600 font-semibold ">Літак</th>
              <th className="p-3 text-center text-gray-600 font-semibold whitespace-nowrap">№ рейсу</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Клас</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Звідки</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Дата (приб.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Час (приб.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Куди</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Дата (відпр.)</th>
              <th className="p-3 text-center text-gray-600 font-semibold ">Час (відпр.)</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b-2 border-gray-200 last:border-none">
                <td className="p-3 text-center">{item.aircraft_name}</td>
                <td className="p-3 text-center">{item.flight_name}</td>
                <td className="p-3 text-center">{item.service_class}</td>
                <td className="p-3 text-center">{item.departure_airport}</td>
                <td className="p-3 text-center">{item.arrival_date}</td>
                <td className="p-3 text-center">{item.arrival_time.slice(0, -3)}</td>
                <td className="p-3 text-center">{item.arrival_airport}</td>
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
