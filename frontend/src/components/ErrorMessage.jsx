function ErrorMessage({ message, onRetry }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-100 border border-red-500 text-red-700 p-4">
      <h2 className="text-lg font-semibold">Сталася помилка</h2>
      <p className="mt-2 text-center">{message || "Щось пішло не так. Спробуйте пізніше."}</p>
      <div className="mt-4">
        {onRetry && (
          <button onClick={onRetry} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Спробувати знову
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
