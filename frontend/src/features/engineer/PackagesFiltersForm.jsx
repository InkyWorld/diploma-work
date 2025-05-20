import { useForm } from "react-hook-form";
import Input from "../../components/forms/Input";

const example = { aircraftCode: "", packageId: "", station: "", startDate: "", endDate: "" };

function PackagesFiltersForm({ isLoading = false, currentParams, setQueryParams }) {
  // console.log("current formmmmmmm", currentParams);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...currentParams,
      startTime: currentParams.startTime ? currentParams.startTime.slice(0, -3) : "",
      endTime: currentParams.endTime ? currentParams.endTime.slice(0, -3) : "",
    },
  });

  const startDateValue = watch("startDate");
  const startTimeValue = watch("startTime");
  const endDateValue = watch("endDate");
  const endTimeValue = watch("endTime");

  function onSubmit(data) {
    console.log("FINAL form data", data);
    setQueryParams({
      ...data,
      aircraftCode: data.aircraftCode.toUpperCase(),
      station: data.station.toUpperCase(),
      startTime: data.startTime ? data.startTime + ":00" : "",
      endTime: data.endTime ? data.endTime + ":00" : "",
    });
  }

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <>
      <form className="px-4 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 bg-white rounded-lg">
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
          label="Аеропорт"
          type="text"
          register={register}
          fieldName="station"
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
          label="Дата початку робіт"
          type="date"
          register={register}
          fieldName="startDate"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (value && !startTimeValue) {
                return "Якщо вказано дату, вкажіть час ";
              }
              return true;
            },
          }}
          errors={errors}
        />
        <Input
          label="Час початку робіт"
          type="time"
          register={register}
          fieldName="startTime"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (value && !startDateValue) {
                return "Якщо вказано час, вкажіть дату";
              }
              return true;
            },
          }}
          errors={errors}
        />
        <Input
          label="Дата завершення робіт"
          type="date"
          register={register}
          fieldName="endDate"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (value && !endTimeValue) {
                return "Якщо вказано дату, вкажіть час";
              }
              return true;
            },
          }}
          errors={errors}
        />
        <Input
          label="Час завершення робіт"
          type="time"
          register={register}
          fieldName="endTime"
          isDisabled={isLoading}
          validation={{
            validate: (value) => {
              if (value && !endDateValue) {
                return "Якщо вказано час, вкажіть дату";
              }
              return true;
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

export default PackagesFiltersForm;
