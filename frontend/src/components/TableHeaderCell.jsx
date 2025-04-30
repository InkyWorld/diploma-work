function TableHeaderCell({ children, styles }) {
  return (
    <th className={`py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${styles || ""}`}>
      {children}
    </th>
  );
}

export default TableHeaderCell;
