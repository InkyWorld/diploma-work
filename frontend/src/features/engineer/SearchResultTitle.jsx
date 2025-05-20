function SearchResultTitle({ queryParams }) {
  console.log("current parammmssss", queryParams);
  const { aircraftCode, packageId, eventId } = queryParams;

  // Масив для зберігання активних фільтрів
  const activeFilters = [];

  if (aircraftCode) activeFilters.push(`код літака - ${aircraftCode}`);
  if (packageId) activeFilters.push(`ідентифікатор пакета - ${packageId}`);
  if (eventId) activeFilters.push(`ідентифікатор завдання - ${eventId}`);

  console.log("activefilters", activeFilters);

  if (activeFilters.length === 0) {
    return "Всі завдання без фільтрів:";
  }

  return `Всі завдання з фільтрами: ${activeFilters.join(", ")}.`;
}

export default SearchResultTitle;
