import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

function ButtonBack({ url }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(url ? url : -1)}
      className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded shadow transition-colors duration-200"
    >
      <IoArrowBackOutline className="w-5 h-5 mr-2" />
      {/* Повернутися на попередню сторінку */}
      Назад
    </button>
  );
}

export default ButtonBack;
