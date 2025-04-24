import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white text-center p-4">
      <div className="max-w-md">
        <div className="text-yellow-500 text-6xl mb-4">🛑</div>
        <h1 className="text-3xl font-bold mb-2">403 — Заборонено</h1>
        <p className="text-gray-600 mb-4">Ви намагаєтесь отримати доступ до ресурсу, який для вас закритий.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Повернутись на головну
        </Link>
      </div>
    </div>
  );
}
