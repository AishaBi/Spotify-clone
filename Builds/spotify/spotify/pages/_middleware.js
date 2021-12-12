import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    //token will exist if user logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET});

    const {pathname } = req.nextUrl 

    //allow requests if it is a 
    //request for next-auth session 
    //or if it is a token request

    if (pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }

    // redirect user to login page if dont have token AND are requesting login page
    if (!token && pathname !== '/login'){
        return NextResponse.redirect('/login');
    }
    
    // redirect to home if token exists
    if (token && pathname == '/login'){
        return NextResponse.redirect('/home');
    }
}