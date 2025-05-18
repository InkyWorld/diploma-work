import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import getShiftPlan from "../../services/shift-supervisor/getShiftPlan";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";

const TurnaroundDetails = () => {
  const { turnaroundId: id } = useParams();
  console.log("turnaround id", id);

  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const shift = searchParams.get("shift");
  console.log("TurnaroundDetails search params", date, shift);

  // const id = "2019-06-03|PS 6231|PSE|PS 6232";
  const [arrivedDate, arrivedFlight, station, departureFlight] = id.split("|");
  console.log("identifiers", arrivedDate, arrivedFlight, station, departureFlight);

  const { data, isLoading } = useQuery({
    queryKey: ["shiftPlan", { date: date, shift: shift }],
    queryFn: getShiftPlan,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 10, // 10 хвилин у кеші
  });

  if (isLoading) return <Loader />;

  const normalize = (value) => (value === "null" ? null : value);

  const foundTurnaround = data.find(
    (item) =>
      item.turnaround.arrived_date === arrivedDate &&
      item.turnaround.aircraft === station &&
      item.turnaround.arrived_flight_name === normalize(arrivedFlight) &&
      item.turnaround.next_departure_flight_name === normalize(departureFlight)
  );
  console.log(`SEARCED OBJECT`, foundTurnaround);
  const { turnaround, work_package } = foundTurnaround;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Деталі Turnaround</h1>

      {/* Turnaround Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Літак: {turnaround.aircraft}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Arrival Block */}
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Прибуття</h3>
            <p>Рейс: {turnaround.arrived_flight_name ?? "—"}</p>
            <p>Дата: {turnaround.arrived_date ?? "—"}</p>
            <p>Час: {turnaround.arrived_time ?? "—"}</p>
          </div>

          {/* Departure Block */}
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Відправлення</h3>
            <p>Рейс: {turnaround.next_departure_flight_name ?? "—"}</p>
            <p>Дата: {turnaround.next_departure_date ?? "—"}</p>
            <p>Час: {turnaround.next_departure_time ?? "—"}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-700 mb-2">Ситуація:</p>
          {/* <p className="italic">{getSituationDescription(turnaround)}</p> */}
          <p>Прибуття під час зміни: {turnaround.arrived_within_shift ? "Так" : "Ні"}</p>
          <p>Виліт під час зміни: {turnaround.departure_within_shift ? "Так" : "Ні"}</p>
        </div>
      </div>

      {/* Work Packages */}
      {work_package.map((wp, idx) => (
        <div key={idx} className="bg-white shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Пакет № {wp.package_number}</h3>
          <p>
            <span className="font-medium">Внутрішній номер:</span> {wp.package_number_internal}
          </p>
          <p>
            <span className="font-medium">Опис:</span> {wp.description}
          </p>
          <p>
            <span className="font-medium">Статус:</span> {wp.status === 0 ? "Активний" : "Інший"}
          </p>
          <p>
            <span className="font-medium">Початок:</span> {wp.start_date} {wp.start_time}
          </p>
          <p>
            <span className="font-medium">Завершення:</span> {wp.end_date} {wp.end_time}
          </p>

          {/* Events */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Завдання:</h4>
            {wp.events.length === 0 ? (
              <p className="text-gray-500 italic">Завдань немає</p>
            ) : (
              <div className="grid gap-4">
                {wp.events.map((event, evIdx) => (
                  <div key={evIdx} className="border border-gray-200 rounded-md p-3 bg-gray-100">
                    <p>
                      <span className="font-semibold ">Ідентифікаційний номер події:</span>{" "}
                      {event.event_performance_number_identifier}
                    </p>
                    <p>
                      <span className="font-semibold">Код події:</span> {event.event_code}
                    </p>
                    <p>
                      <span className="font-semibold">Опис:</span> {event.event_display_description}
                    </p>
                    <p>
                      <span className="font-semibold">Людино-години:</span> {event.estimated_man_hours}
                    </p>
                    <p>
                      <span className="font-semibold">Статус:</span> {event.status}
                    </p>
                    <p>
                      <span className="font-semibold">Виконано:</span> {event.completed ? "Так" : "Ні"}
                    </p>
                    <Link
                      // to={`package/${wp.package_number_internal}/task/${event.event_performance_number_identifier}`}
                      to={{
                        pathname: `package/${wp.package_number_internal}/task/${event.event_performance_number_identifier}`,
                        search: `?${searchParams.toString()}`,
                      }}
                      className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Призначити працівників
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TurnaroundDetails;
