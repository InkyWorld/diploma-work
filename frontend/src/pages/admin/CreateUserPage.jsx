import { useMutation, useQueryClient } from "@tanstack/react-query";
import addUser from "../../services/admin/addUser";
import TestComponent from "../../components/TestComponent";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/UserForm";

function CreateUserPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ finalData }) => addUser(finalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("User successfully added");
      navigate("/admin");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  // return <TestComponent mutate={mutate} isPending={isPending} />;
  return <UserForm mutate={mutate} isPending={isPending} />;
}

export default CreateUserPage;
