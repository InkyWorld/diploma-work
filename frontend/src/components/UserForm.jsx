// components/UserForm.jsx
import { useState } from "react";
import { useSelector } from "react-redux";

export default function UserForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    // full_name: initialData.full_name || "",
    // email: initialData.email || "",
    // role: initialData.role || "technician",
    // age: initialData.age || "",
    // gender: initialData.gender || "male",
    // img_profile: initialData.img_profile || "",

    username: "test3@hedotu.com",
    password: "technician",
    full_name: "NEWTESTUSER",
    role: "technician",
    age: 50,
    gender: "M",
    img_profile: initialData.img_profile || "",
  });

  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        img_profile: file,
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("final data", formData);
    onSubmit({ formData, accessToken });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
      {/* <h2 className="text-xl font-bold text-gray-700 mb-4">
        {initialData.full_name ? "Редагувати користувача" : "Створити користувача"}
      </h2> */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {initialData.full_name ? "Редагування користувача" : "Додавання користувача"}
        </h2>
      </div>

      {/* ПІБ та Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-600 mb-1">ПІБ</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
            placeholder="Введіть ПІБ"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
            placeholder="example@email.com"
          />
        </div>
      </div>

      {/* Роль */}
      <div>
        <label className="block text-lg font-medium text-gray-600 mb-1">Роль</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
        >
          <option value="admin">Адміністратор</option>
          <option value="engineer">Інженер</option>
          <option value="technician">Технік</option>
          <option value="shift supervisor">Бригадир</option>
          <option value="flight dispatcher">Диспетчер</option>
        </select>
      </div>

      {/* Вік і Стать */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-600 mb-1">Вік</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
            placeholder="Наприклад, 32"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600 mb-1">Стать</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
          >
            <option value="male">Чоловік</option>
            <option value="female">Жінка</option>
          </select>
        </div>
      </div>

      {/* Фото профілю */}
      <div>
        <label className="block text-lg font-medium text-gray-600 mb-2">Фото профілю</label>

        <div className="flex items-center gap-4">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            Обрати файл
          </label>

          <span className="text-gray-500 text-sm">
            {formData.img_profile ? formData.img_profile.name : "Файл не вибрано"}
          </span>
        </div>

        <input
          type="file"
          id="imageUpload"
          name="img_profile"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {/* <div>
        <label className="block text-lg font-medium text-gray-600 mb-1">Фото профілю</label>
        <input
          type="text"
          name="img_profile"
          value={formData.img_profile}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
          placeholder="https://example.com/profile.jpg"
        />
      </div> */}

      {/* Кнопка */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-semibold transition duration-300"
        >
          {initialData.full_name ? "Оновити користувача" : "Додати користувача"}
        </button>
      </div>
    </form>
  );
}
