export default function EventCard({ data, buttonText, handleClick, isLoading, background }) {
  const {
    completed,
    event_code,
    event_display_description,
    event_performance_number_identifier,
    estimated_man_hours,
    status,
  } = data;

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm space-y-1 ${
        completed ? "bg-green-100 border-green-500" : `${background || "bg-white"} border-gray-300`
      }`}
    >
      <h3 className="text-lg font-semibold">#{event_performance_number_identifier}</h3>
      <p className="text-gray-800">
        <span className="font-semibold">Код завдання:</span> {event_code}
      </p>
      <p className="text-gray-800">
        <span className="font-semibold text-gray-800">Опис:</span> {event_display_description}
      </p>
      {estimated_man_hours !== undefined && (
        <p className="text-gray-800">
          <span className="font-semibold text-gray-800">Людино-години:</span> {estimated_man_hours}
        </p>
      )}
      {status !== undefined && (
        <p className="text-gray-800">
          <span className="font-semibold">Статус:</span> {status}
        </p>
      )}
      {completed !== undefined && (
        <>
          <p className="text-gray-800">
            <span className="font-semibold">Виконано:</span>
            {completed ? " Так" : " Ні"}
            {/* {completed ? (
              <span className="text-green-600 font-medium uppercase">Так</span>
            ) : (
              <span className="text-red-600 font-medium uppercase">Ні</span>
            )} */}
          </p>
          {!completed && buttonText && (
            <button
              // onClick={() => mutate({ taskId: task.event_performance_number_identifier, shift: shift })}
              // disabled={isPending || task.completed}
              onClick={handleClick}
              disabled={isLoading}
              className={`text-white px-4 py-2 rounded font-medium bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {buttonText}
            </button>
          )}
        </>
      )}
    </div>
  );
}

{
  /* <button
  onClick={() => mutate({ taskId: task.event_performance_number_identifier, shift: shift })}
  disabled={isPending || task.completed}
  className={`px-4 py-2 rounded font-medium ${
    completed ? "bg-blue-300 text-white cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
>
  {completed ? "Виконано" : "Позначити як виконано"}
</button> */
}
