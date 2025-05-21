import { useState } from "react";
import { BiErrorCircle, BiHide, BiShow } from "react-icons/bi";

function PasswordInput({ label, placeholder, register, fieldName, validation, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative pb-6.5">
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        className={`w-full border rounded-lg p-2 ${errors[fieldName] ? "border-red-600" : "border-gray-300"}`}
        placeholder={placeholder}
        {...register(fieldName, validation)}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-9.5 right-2 text-gray-400"
      >
        {showPassword ? <BiHide className="w-6 h-6 " /> : <BiShow className="w-6 h-6" />}
      </button>
      {errors[fieldName] && (
        // <div className="flex items-center gap-2 text-red-600 py-2 rounded-md text-sm">
        <div className="absolute bottom-0 left-0 pb-1 flex items-center gap-2 text-red-600 rounded-md text-sm">
          <BiErrorCircle className="text-red-500 w-5 h-5" />
          <p>{errors[fieldName].message}</p>
        </div>
      )}
    </div>
  );
}
export default PasswordInput;
