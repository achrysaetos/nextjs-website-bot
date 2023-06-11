import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/user";
import Spinner from "../components/spinner";

const Subscription = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Call api to load the stripe customer portal
  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  useEffect(loadPortal, []);

  return <Spinner />;
};

// Load user props
export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Subscription;
