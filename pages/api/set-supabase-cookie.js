import { supabase } from "../../utils/supabase";

// Create api route to set supabase session cookie
const handler = async (req, res) => {
  await supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
