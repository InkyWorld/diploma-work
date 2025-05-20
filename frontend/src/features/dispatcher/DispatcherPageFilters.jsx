export const filterData = (data, filter) => {
  switch (filter) {
    case "departure_kbp":
      return data.filter((item) => item.departure_airport === "KBP");
    case "arrival_kbp":
      return data.filter((item) => item.arrival_airport === "KBP");
    case "arrival_day":
      return data.filter((item) => {
        const hour = parseInt(item.arrival_time.slice(0, 2), 10);
        return hour >= 8 && hour < 20;
      });
    case "arrival_night":
      return data.filter((item) => {
        const hour = parseInt(item.arrival_time.slice(0, 2), 10);
        return hour < 8 || hour >= 20;
      });
    case "departure_day":
      return data.filter((item) => {
        const hour = parseInt(item.departure_time.slice(0, 2), 10);
        return hour >= 8 && hour < 20;
      });
    case "departure_night":
      return data.filter((item) => {
        const hour = parseInt(item.departure_time.slice(0, 2), 10);
        return hour < 8 || hour >= 20;
      });
    default:
      return data;
  }
};

function DispatcherPageFilters({ queryParams, handleFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 my-6">
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("all")}
      >
        Усі
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "departure_kbp" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("departure_kbp")}
      >
        Відправлення з KBP
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "arrival_kbp" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("arrival_kbp")}
      >
        Прибуття в KBP
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "arrival_day" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("arrival_day")}
      >
        Прибуття в денну зміну
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "arrival_night" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("arrival_night")}
      >
        Прибуття в нічну зміну
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "departure_day" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("departure_day")}
      >
        Відправлення в денну зміну
      </button>
      <button
        className={`px-4 py-2 rounded-xl text-sm ${
          queryParams.filter === "departure_night" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handleFilterChange("departure_night")}
      >
        Відправлення в нічну зміну
      </button>
    </div>
  );
}

export default DispatcherPageFilters;
