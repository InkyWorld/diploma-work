const Table = ({ columns, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-md bg-white">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            {columns.map((col) => (
              <th key={col} className="px-6 py-4 border-b border-gray-200">
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
