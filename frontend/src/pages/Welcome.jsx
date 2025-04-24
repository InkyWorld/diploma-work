export default function Welcome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="text-center px-6 py-12">
        {/* Логотип/Назва системи */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Ласкаво просимо до <span className="text-blue-600">Системи Технічного Обслуговування Літаків</span>
        </h1>

        {/* Опис системи */}
        <p className="text-lg text-gray-600 mb-8">
          Ця система призначена для ефективного управління технічним обслуговуванням літаків. У нас є все для того, щоб
          кожен користувач міг виконувати свої обов'язки в межах своєї ролі.
        </p>

        {/* Зображення фон */}
        {/* <div className="mb-6">
          <img
            src="https://skyavia.com.ua/small/right_68_tehnicheskoe-obsluzhivanie.jpg"
            alt="Airplane"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div> */}

        {/* Кнопки для входу/реєстрації */}
        <div className="space-x-4">
          <a
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Вхід
          </a>
          <a
            to="/register"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
          >
            Реєстрація
          </a>
        </div>
      </div>
    </div>
  );
}
