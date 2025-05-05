import { useMutation } from "@tanstack/react-query";
import UserForm from "../../components/UserForm";
import addUser from "../../services/admin/addUser";

function CreateUserPage() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ formData, accessToken }) => addUser(formData, accessToken),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("User successfully added");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return <UserForm onSubmit={mutate} />;
}

export default CreateUserPage;
