"use server"
import { cookies } from "next/headers";

export const fetchCSRFToken = async () => {
    "use server"
    const cookieStore = cookies();
    console.log("fetching cookies")
    console.log("cookieStore: ", cookieStore);
    console.log("all: ", cookieStore.getAll());
    return cookieStore.get("csrf_access_token")?.value || "";
  };

export const setToken = async (token : string) => {
    const cookieStore = cookies();
    console.log("setting cookies")
    console.log("cookieStore: ", cookieStore);
    console.log("all: ", cookieStore.getAll());
    return cookieStore.set("csrf_access_token", token);
}