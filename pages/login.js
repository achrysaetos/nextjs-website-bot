import { useEffect } from "react";
import { useUser } from "../context/user";
import Spinner from "../components/spinner";

// Call useUser() on mount
const Login = () => {
  const { login } = useUser();

  useEffect(login, []);

  return <Spinner />;
};

export default Login;
