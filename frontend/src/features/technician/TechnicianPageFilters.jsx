import ButtonFilter from "../../components/ButtonFilter";

export function applyTechnicianFilters(data, filterValue) {
  switch (filterValue) {
    case "pending":
      return data.filter((item) => item.completed === false);
    case "done":
      return data.filter((item) => item.completed === true);
    case "all":
      return data;
  }
}
function TechnicianPageFilters({ currentFilter, setFilter }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <ButtonFilter currentFilter={currentFilter} buttonValue="all" onClick={setFilter}>
        Всі завдання
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="done" onClick={setFilter}>
        Виконані
      </ButtonFilter>
      <ButtonFilter currentFilter={currentFilter} buttonValue="pending" onClick={setFilter}>
        Не виконані
      </ButtonFilter>
    </div>
  );
}

export default TechnicianPageFilters;
