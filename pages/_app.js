import "tailwindcss/tailwind.css";
import UserProvider from "../context/user";
import Nav from "../components/nav";

function MyApp({ Component, pageProps }) {

  // User provider to track login status, Nav component displayed across all pages
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
