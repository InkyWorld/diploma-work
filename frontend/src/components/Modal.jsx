import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

function Modal({ children, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Закриває при кліку на фон
    >
      <div
        className="relative bg-white rounded-xl p-6 shadow-lg max-w-3/5 md:max-w-1/2 lg:max-w-1/3"
        onClick={(e) => e.stopPropagation()} // Запобігає закриттю при кліку всередині
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          <IoCloseOutline className="w-8 h-8" />
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;
