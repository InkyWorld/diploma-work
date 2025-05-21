import { useLocation, useNavigate } from "react-router-dom";
import UserForm from "../../features/admin/UserForm";
import TestComponent from "../../components/TestComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateUser from "../../services/admin/updateUser";
import toast from "react-hot-toast";

function EditUserPage() {
  const location = useLocation();
  const userData = location.state;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // console.log("EDIT USER DATA", userData);
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, finalData }) => updateUser(email, finalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin");
      toast.success("User successfully updated");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  // return <TestComponent initialData={userData} mutate={mutate} isPending={isPending} />;
  return <UserForm initialData={userData} mutate={mutate} isPending={isPending} />;
}

export default EditUserPage;
