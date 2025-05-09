import { useLocation, useNavigate } from "react-router-dom";
import UserForm from "../../components/UserForm";
import TestComponent from "../../components/TestComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateUser from "../../services/admin/updateUser";

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
      console.log("User successfully updated");
      navigate("/admin");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  // return <TestComponent initialData={userData} mutate={mutate} isPending={isPending} />;
  return <UserForm initialData={userData} mutate={mutate} isPending={isPending} />;
}

export default EditUserPage;
