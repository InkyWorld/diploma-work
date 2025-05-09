import { useState } from "react";
import { BiErrorCircle, BiHide, BiShow } from "react-icons/bi";

function PasswordInput({ label, placeholder, register, fieldName, validation, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative pb-8">
      <label className="block text-lg font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
        placeholder={placeholder}
        {...register(fieldName, validation)}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-11 right-2 text-gray-400"
      >
        {showPassword ? <BiHide className="w-7 h-7" /> : <BiShow className="w-7 h-7" />}
      </button>
      {errors[fieldName] && (
        // <div className="flex items-center gap-2 text-red-600 py-2 rounded-md text-sm">
        <div className="absolute bottom-0 left-0 pb-2 flex items-center gap-2 text-red-600 rounded-md text-sm">
          <BiErrorCircle className="text-red-500 w-5 h-5" />
          <p>{errors[fieldName].message}</p>
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
