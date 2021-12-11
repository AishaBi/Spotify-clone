import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../../../../lib/spotify";


async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);
        
        const { body: refreshedToken }  = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            // 1 hr as 3600 returns from api
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
            //replace token if new one came back else go back to old refresh token
        }


    } catch (error) {
        console.error(error)
        
        return{
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET, 
  pages: {
      signIn: '/login'
  },
  callbacks:{
      async jwt({ token,  account, user}){
          
        //if initiale sign in
        if (account && user) {
            return{
                ...token,
                accessToken: account.access_token, 
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                //time in milliseconds not seconds thus multiply it
                aceessTokenExpires: account.expires_at * 1000,

            }
        }

        // if come back to website before hour ends (expiry time)
        //return previous token if access token not expired
        if(Date.now() < token.accessTokenExpires) {
            console.log("EXISITING ACCESS TOKEN IS VALID");
            return token;
        }

        // if access token has expired (over an hour), need to refresh token
        console.log("ACCESS TOKEN HAS EXPIERED, REFRESHING..");
        return await refreshAccessToken(token);
      },

      //now have token and going to create a session object, which user can tap into
      //as part of their client session
      async session({session, token}) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.username = token.username;

          return session;
      }
  },
});