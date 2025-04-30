import { useLocation } from "react-router-dom";
import UserForm from "../../components/UserForm";

function EditUserPage() {
  const location = useLocation();
  const userData = location.state;
  return <UserForm initialData={userData} />;
}

export default EditUserPage;
