import { useForm } from "react-hook-form";
import { useState } from "react";

import PasswordInput from "../../components/forms/PasswordInput";
import Input from "../../components/forms/Input";

import { BiErrorCircle } from "react-icons/bi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ButtonBack from "../../components/ButtonBack";

function UserForm({ initialData = {}, mutate, isPending }) {
  const isEditMode = initialData.full_name ? true : false;
  console.log("IS CURRENT MODE EDIT", isEditMode);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      email: initialData.email || "",
      password: "",
      full_name: initialData.full_name || "",
      role: initialData.role || "technician",
      age: initialData.age || "",
      gender: initialData.gender || "M",
      img_profile: initialData.img_profile || "",
    },
  });

  //TODO: Слідкуємо за значенням поля password
  const password = watch("password");

  //TODO: Перемикання зміни пароля у Edit mode
  const [wantChangePassword, setWantChangePassword] = useState(false);

  //TODO: Назва обраного файлу
  const [selectedFile, setSelectedFile] = useState("");
  // console.log(selectedFile);

  const onSubmit = (data) => {
    let finalData;
    if (isEditMode) {
      const changedFieldsKey = Object.keys(dirtyFields);
      const changedFields = changedFieldsKey.reduce((acc, key) => {
        // acc[key] = getValues(key);
        const value = getValues(key);
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      // console.log("changed", changedFields);
      finalData = { ...changedFields };
      console.log("Edit mode final", finalData);
      mutate({ email: initialData.email, finalData });
    } else {
      finalData = { ...data, age: +data.age, img_profile: data.img_profile[0] };
      console.log("Add mode final", finalData);
      mutate({ finalData });
    }
  };

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <div className="flex items-center justify-center md:h-full bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mx-auto w-full md:rounded-lg bg-white p-4  md:max-w-5/6"
      >
        <ButtonBack />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mt-2 mb-6">
            {isEditMode ? "Редагування користувача" : "Додавання користувача"}
          </h2>
        </div>

        {/* ПІБ та Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Input
            label="Email"
            placeholder="example@email.com"
            type="text"
            register={register}
            fieldName="email"
            isDisabled={isEditMode}
            validation={{
              required: "Обовязкове поле",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, // патерн для перевірки email
                message: "Неправильний формат email",
              },
            }}
            errors={errors}
          />

          <Input
            label="ПІБ"
            placeholder="Введіть ПІБ"
            type="text"
            register={register}
            fieldName="full_name"
            validation={{
              required: "Обовязкове поле",
              minLength: { value: 6, message: "Мінімум 6 символів" },
            }}
            errors={errors}
          />
        </div>

        {/* Вік і Стать */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Вік"
            placeholder="Наприклад, 32"
            type="number"
            register={register}
            fieldName="age"
            validation={{
              required: "Обовязкове поле",
              min: { value: 18, message: "Мінімальний вік 18" },
            }}
            errors={errors}
          />

          <div className="relative pb-6.5">
            {/* <label className="block text-lg font-medium text-gray-600 mb-1">Стать</label> */}
            <label className="block font-medium text-gray-700 mb-1">Стать</label>
            <select className="appearance-none p-2 w-full border border-gray-300 rounded-lg" {...register("gender")}>
              <option value="M">Чоловік</option>
              <option value="F">Жінка</option>
            </select>
            <IoIosArrowDropdownCircle className="w-6 h-6 pointer-events-none absolute top-9.5 right-2 text-gray-300" />
          </div>
        </div>

        {/* Роль i Фото профілю */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative pb-6.5">
            <label className="block font-medium text-gray-700 mb-1">Роль</label>
            <select className="appearance-none p-2 w-full border border-gray-300 rounded-lg" {...register("role")}>
              <option value="technician">Технік</option>
              <option value="admin">Адміністратор</option>
              <option value="engineer">Інженер</option>
              <option value="shift supervisor">Бригадир</option>
              <option value="flight dispatcher">Диспетчер</option>
            </select>
            <IoIosArrowDropdownCircle className="w-6 h-6 pointer-events-none absolute top-9.5 right-2 text-gray-300" />
          </div>

          <div className="relative pb-6.5">
            <label className="block font-medium text-gray-700 mb-2">Фото профілю</label>

            <div className="flex items-center gap-4">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer inline-flex items-center p-2 bg-slate-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-600 transition"
              >
                Обрати файл
              </label>

              <span className="text-gray-500 text-sm">{selectedFile || "Файл не вибрано"}</span>
            </div>

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              {...register("img_profile", {
                validate: (value) => {
                  // Поле обов'язкове лише за певної умови
                  if (!isEditMode && value.length === 0) {
                    return "Файл обов'язковий";
                  }
                  return true;
                },
                onChange: (e) => {
                  setSelectedFile(e.target.files[0].name);
                },
              })}
            />
            {errors.img_profile && (
              <div className="absolute bottom-0 left-0 pb-1 flex items-center gap-2 text-red-600 rounded-md text-sm">
                <BiErrorCircle className="text-red-500 w-5 h-5" />
                <p>{errors.img_profile.message}</p>
              </div>
            )}
          </div>
        </div>

        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <PasswordInput
              label="Пароль"
              placeholder="Введіть пароль"
              register={register}
              fieldName="password"
              validation={{
                required: "Це поле обов’язкове",
                minLength: { value: 6, message: "Мінімум 6 символів" },
              }}
              errors={errors}
            />
            <PasswordInput
              label="Підтвердження пароля"
              placeholder="Повторіть пароль"
              register={register}
              fieldName="passwordConfirm"
              validation={{
                required: "Підтвердження пароля обов'язкове",
                validate: (value) => value === password || "Паролі не співпадають",
              }}
              errors={errors}
            />
          </div>
        )}

        {isEditMode && (
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-1">Пароль</label>
            <button
              type="button"
              className="cursor-pointer inline-flex items-center p-2 mb-2 bg-slate-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-600 transition"
              onClick={() => {
                setValue("password", "");
                setValue("passwordConfirm", "");
                setWantChangePassword((cur) => !cur);
              }}
            >
              {!wantChangePassword ? "Змінити пароль" : "Скасувати"}
            </button>
            {wantChangePassword && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 pt-4 pb-2 space-y-4 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <PasswordInput
                    label="Пароль"
                    placeholder="Введіть пароль"
                    register={register}
                    fieldName="password"
                    validation={{
                      required: "Це поле обов’язкове",
                      minLength: { value: 6, message: "Мінімум 6 символів" },
                    }}
                    errors={errors}
                  />
                  <PasswordInput
                    label="Підтвердження пароля"
                    placeholder="Повторіть пароль"
                    register={register}
                    fieldName="passwordConfirm"
                    validation={{
                      required: "Підтвердження пароля обов'язкове",
                      validate: (value) => value === password || "Паролі не співпадають",
                    }}
                    errors={errors}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Кнопка */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-semibold transition duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={isPending || (isEditMode && !isDirty)}
          >
            {isEditMode ? "Оновити користувача" : "Додати користувача"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
