import { useForm } from "react-hook-form";
import Input from "../../components/forms/Input";
import { useState } from "react";

function ShiftPlanForm({ isLoading, setQueryParams, isPending, updateData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data, param) {
    if (param === "get") {
      console.log("Отримання shift plan", data, param);
      setQueryParams(data);
    }
    if (param === "update") {
      console.log("ОНОВЛЕННЯ shift plan", data, param);
      updateData(data);
    }
    // setQueryParams(data);
  }

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <>
      <form className="px-6 grid grid-cols-1 md:grid-cols-4 gap-x-4">
        <Input
          label="Дата"
          type="date"
          register={register}
          fieldName="date"
          isDisabled={isLoading || isPending}
          validation={{
            required: "Обовязкове поле",
          }}
          errors={errors}
        />

        <div className="flex flex-col mb-6.5">
          <label htmlFor="shift" className="mb-1 font-medium text-gray-700">
            Зміна
          </label>
          <select id="shift" {...register("shift")} className="p-2 border border-gray-300 rounded-md">
            <option value="day">Денна</option>
            <option value="night">Нічна</option>
          </select>
        </div>

        <div className="flex items-center mb-4 md:mb-0">
          <button
            type="submit"
            onClick={handleSubmit((data) => onSubmit(data, "get"), onError)}
            disabled={isLoading || isPending}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Показати
          </button>
        </div>

        <div className="flex items-center ">
          <button
            type="submit"
            onClick={handleSubmit((data) => onSubmit(data, "update"), onError)}
            disabled={isLoading || isPending}
            className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
          >
            Оновити
          </button>
        </div>
      </form>
    </>
  );
}

export default ShiftPlanForm;
