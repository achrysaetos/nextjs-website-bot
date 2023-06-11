import { useEffect } from "react";
import { useUser } from "../context/user";
import Spinner from "../components/spinner";

// Call useUser() on mount
const Logout = () => {
  const { logout } = useUser();

  useEffect(logout, []);

  return <Spinner />;
};

export default Logout;
