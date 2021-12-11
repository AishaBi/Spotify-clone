import "tailwindcss/tailwind.css";
import {SessionProvider, signOut} from "next-auth/react";


function MyApp({ Component, pageProps: {session, ...pageProps} }
  ) {
    return (
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    ); 
  } 

  export default MyApp;
