"use server"
import { cookies } from "next/headers";

export const fetchCSRFToken = async () => {
    "use server"
    const cookieStore = cookies();
    return cookieStore.get("csrf_access_token")?.value || "";
  };

export const setToken = async (token : string) => {
    const cookieStore = cookies();
    return cookieStore.set("csrf_access_token", token);
}