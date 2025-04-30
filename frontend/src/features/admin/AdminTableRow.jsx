import { useState } from "react";
import Modal from "../../components/Modal";
import deleteUser from "../../services/admin/deleteUser";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function AdminTableRow({ user }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  function handleToggleModal() {
    setIsOpenModal((cur) => !cur);
    console.log("Modal toggle");
  }

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, accessToken }) => deleteUser(email, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("User successfully deleted");
      handleToggleModal();
    },
    onError: (error) => {
      console.error(error);
      handleToggleModal();
    },
  });

  return (
    <>
      {isOpenModal && (
        <Modal onClose={handleToggleModal}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Підтвердити видалення</h2>
          <p className="text-gray-600 mb-6">
            Ви впевнені, що хочете видалити користувача {user.full_name} ({user.email})? Цю дію не можна скасувати.
          </p>

          <div className="flex justify-end gap-4">
            <button
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              onClick={handleToggleModal}
            >
              Скасувати
            </button>
            <button
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => {
                mutate({ email: user.email, accessToken });
              }}
            >
              {isPending ? "Видаляється..." : "Видалити"}
            </button>
          </div>
        </Modal>
      )}
      <tr className="border-b-2 border-gray-200 last:border-none">
        <td className="py-4 px-6">
          <img src={user.img_profile} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
        </td>
        <td className="py-4 px-6">{user.full_name}</td>
        <td className="py-4 px-6 capitalize">{user.role}</td>
        <td className="py-4 px-6 hidden md:table-cell">{user.email}</td>
        <td className="py-4 px-6 hidden lg:table-cell">{user.age}</td>
        <td className="py-4 px-6 hidden lg:table-cell">{user.gender === "M" ? "Чоловік" : "Жінка"}</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center flex-col gap-2 h-full">
            <button
              className="bg-gray-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs"
              onClick={() => {
                navigate(`/admin/users/edit/${user.email}`, { state: user });
              }}
            >
              Редагувати
            </button>
            <button
              className="bg-rose-400 hover:bg-rose-600 text-white px-3 py-1 rounded-lg text-xs"
              onClick={handleToggleModal}
            >
              Видалити
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default AdminTableRow;
