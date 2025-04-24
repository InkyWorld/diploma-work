import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-center p-4">
      <div className="max-w-md">
        <div className="text-6xl mb-4 text-blue-600">🔍</div>
        <h1 className="text-3xl font-bold mb-2">404 — Сторінку не знайдено</h1>
        <p className="text-gray-600 mb-4">Упс! Сторінка, яку ви шукаєте, не існує.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Повернутись на головну
        </Link>
      </div>
    </div>
  );
}
