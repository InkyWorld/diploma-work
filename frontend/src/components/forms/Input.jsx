import { BiErrorCircle } from "react-icons/bi";

function Input({
  label,
  type,
  placeholder,
  defaultValue,
  isDisabled = false,
  register,
  fieldName,
  validation,
  errors,
}) {
  // console.log("disabled", label, isDisabled);
  return (
    <div className="relative pb-6.5">
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className={`w-full border rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 ${
          errors[fieldName] ? "border-red-600" : "border-gray-300"
        }`}
        placeholder={placeholder}
        disabled={isDisabled}
        defaultValue={defaultValue}
        {...register(fieldName, validation)}
      />
      {errors[fieldName] && (
        <div className="absolute bottom-0 left-0 pb-1 flex items-center gap-2 text-red-600 rounded-md text-sm">
          {/* <div className=" flex items-center gap-2 text-red-600 py-2 rounded-md text-sm"> */}
          <BiErrorCircle className="text-red-500 w-5 h-5" />
          <p>{errors[fieldName].message}</p>
        </div>
      )}
    </div>
  );
}

export default Input;
// <div className="relative pb-8">
//   <label className="block text-lg font-medium text-gray-600 mb-1">{label}</label>
//   <input
//     type={type}
//     className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
//     placeholder={placeholder}
//     disabled={isDisabled}
//     {...register(fieldName, validation)}
//   />
//   {errors[fieldName] && (
//     <div className="absolute bottom-0 left-0 pb-2 flex items-center gap-2 text-red-600 rounded-md text-sm">
//       {/* <div className=" flex items-center gap-2 text-red-600 py-2 rounded-md text-sm"> */}
//       <BiErrorCircle className="text-red-500 w-5 h-5" />
//       <p>{errors[fieldName].message}</p>
//     </div>
//   )}
// </div>
