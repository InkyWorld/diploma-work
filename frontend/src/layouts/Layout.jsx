const Layout = () => {
  const menuItems = [
    { path: "#", label: "Головна" },
    { path: "#", label: "Користувачі" },
    { path: "#", label: "Звіти" },
    { path: "#", label: "Налаштування" },
  ];

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] grid-rows-[auto_1fr]">
      {/* Header */}
      <header className="col-span-full bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Система техобслуговування літаків</h1>
        <div className="flex items-center gap-4">
          <span>👤 Ім’я користувача</span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Вийти</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:block bg-gray-100 p-4">
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.path} className="text-gray-700 hover:text-blue-700 font-medium">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Контент для ролі</h2>
        <p className="mb-2">Тут буде відображатися контент, який залежить від ролі користувача.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-4">Блок 1</div>
          <div className="bg-white rounded-lg shadow p-4">Блок 2</div>
          <div className="bg-white rounded-lg shadow p-4">Блок 3</div>
          <div className="bg-white rounded-lg shadow p-4">Блок 4</div>
          <div className="bg-white rounded-lg shadow p-4">Блок 5</div>
          <div className="bg-white rounded-lg shadow p-4">Блок 6</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
