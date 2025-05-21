function ButtonFilter({ children, currentFilter, buttonValue, onClick }) {
  return (
    <button
      onClick={() => onClick(buttonValue)}
      className={`px-4 py-2 text-sm ${
        buttonValue === currentFilter
          ? " bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          : "bg-gray-200 rounded-xl hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export default ButtonFilter;
