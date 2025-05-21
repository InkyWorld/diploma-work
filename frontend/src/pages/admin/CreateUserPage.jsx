import { useMutation, useQueryClient } from "@tanstack/react-query";
import addUser from "../../services/admin/addUser";
import { useNavigate } from "react-router-dom";
import UserForm from "../../features/admin/UserForm";
import toast from "react-hot-toast";

function CreateUserPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ finalData }) => addUser(finalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin");
      // console.log("User successfully added");
      toast.success("User successfully added");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return <UserForm mutate={mutate} isPending={isPending} />;
}

export default CreateUserPage;
