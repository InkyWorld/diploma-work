import { useForm } from "react-hook-form";
import Input from "../../components/forms/Input";

function EventsFiltersForm({ isLoading = false, setQueryParams }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    setQueryParams({ ...data, aircraftCode: data.aircraftCode.toUpperCase() });
  }

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <>
      <form className="px-4 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 bg-white rounded-lg">
        <Input
          label="Код літака"
          type="text"
          register={register}
          fieldName="aircraftCode"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (!value) return true; // необов’язкове поле
              return /^[A-Za-z]{3}$/.test(value) || "Має бути рівно 3 латинські літери";
            },
          }}
          errors={errors}
        />
        <Input
          label="Ідентифікатор пакета"
          type="number"
          register={register}
          fieldName="packageId"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (!value) return true; // необов’язкове поле
              return /^\d{5}$/.test(value) || "Має бути рівно 5 цифр";
            },
          }}
          errors={errors}
        />
        <Input
          label="Ідентифікатор завдання"
          type="number"
          register={register}
          fieldName="eventId"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (!value) return true; // необов’язкове
              return /^\d{7}$/.test(value) || "Має бути рівно 7 цифр";
            },
          }}
          errors={errors}
        />

        <div className="flex items-center mb-4 md:mb-0">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit, onError)}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Застосувати фільтри
          </button>
        </div>
      </form>
    </>
  );
}

export default EventsFiltersForm;
