import { useForm } from "react-hook-form";
import Input from "../../components/forms/Input";

function FlightsForm({ isLoading, setQueryParams }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log("submitted", data);
    setQueryParams(data);
  }

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4"
    >
      <Input
        label="Початкова дата"
        type="date"
        register={register}
        fieldName="start_date"
        isDisabled={isLoading}
        validation={{
          required: "Обовязкове поле",
        }}
        errors={errors}
      />

      <Input
        label="Кінцева дата"
        type="date"
        register={register}
        fieldName="end_date"
        isDisabled={isLoading}
        validation={{
          required: "Обовязкове поле",
        }}
        errors={errors}
      />

      <div className="flex flex-col mb-6.5">
        <label htmlFor="transit" className="mb-1 font-medium text-gray-700">
          Тип рейсу
        </label>
        <select id="transit" {...register("transit")} className="p-2 border border-gray-300 rounded-md">
          <option value="departure">Відправлення</option>
          <option value="arrival">Прибуття</option>
        </select>
      </div>

      <div className="flex items-center ">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Показати
        </button>
      </div>
    </form>
  );
}

export default FlightsForm;
