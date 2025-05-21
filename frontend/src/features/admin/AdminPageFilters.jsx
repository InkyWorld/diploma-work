import ButtonFilter from "../../components/ButtonFilter";

export function applyAdminFilters(data, filterValue) {
  switch (filterValue) {
    case "shift-supervisor":
      return data.filter((item) => item.role === "shift supervisor");
    case "technician":
      return data.filter((item) => item.role === "technician");
    case "engineer":
      return data.filter((item) => item.role === "engineer");
    case "dispatcher":
      return data.filter((item) => item.role === "flight dispatcher");
    case "all":
      return data;
  }
}
function AdminPageFilters({ currentFilter, setFilter }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <ButtonFilter currentFilter={currentFilter} buttonValue="all" onClick={setFilter}>
        Всі
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="shift-supervisor" onClick={setFilter}>
        Бригадири
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="technician" onClick={setFilter}>
        Техніки
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="engineer" onClick={setFilter}>
        Інженери
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="dispatcher" onClick={setFilter}>
        Диспетчери
      </ButtonFilter>
    </div>
  );
}

export default AdminPageFilters;
