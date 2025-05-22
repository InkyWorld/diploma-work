import { useDispatch } from "react-redux";
import login from "../features/auth/login";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Input from "../components/forms/Input";
import { useForm } from "react-hook-form";
import PasswordInput from "../components/forms/PasswordInput";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("Login page init");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log("login form submitted", data);
    login(data, navigate, dispatch);
  }

  const onError = (errors) => {
    console.log("Помилки валідації:", errors);
  };

  return (
    <div className="relative bg-[url('https://www.publicdomainpictures.net/pictures/370000/nahled/himmel-wolken-wetter-hintergrund-1601102999r1t.jpg')] bg-cover bg-center h-full w-full flex items-center justify-center">
      <form className="relative w-96 mt-10 p-6 m-4 bg-white rounded-2xl shadow-lg">
        <IoMdClose
          onClick={() => navigate(-1)}
          className="absolute text-white w-6 h-6 top-2 right-2 p-1 bg-gray-400 rounded-full"
        />
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Вхід в систему</h2>

        <Input
          label="Email"
          placeholder="example@email.com"
          type="text"
          register={register}
          fieldName="username"
          validation={{
            required: "Обовязкове поле",
            // pattern: {
            //   value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            //   message: "Неправильний формат email",
            // },
          }}
          errors={errors}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Введіть пароль"
          register={register}
          fieldName="password"
          validation={{
            required: "Це поле обов’язкове",
            // minLength: { value: 6, message: "Мінімум 6 символів" },
          }}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          onClick={handleSubmit(onSubmit, onError)}
        >
          Увійти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
