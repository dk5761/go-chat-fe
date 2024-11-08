import { postApiRQ } from "@/services/api/api";
import { getAuthUrl } from "@/services/api/constants";

interface ILogin {
  token: string;
}

export const login = async (
  email: string,
  username: string,
  password: string
) => {
  const url = getAuthUrl("login");
  const response = await postApiRQ<ILogin>(url, {
    email,
    username,
    password,
  });

  console.log({ response });
  return response;
};

export const signUp = async (
  email: string,
  username: string,
  password: string
) => {
  const url = getAuthUrl("register");
  const response = await postApiRQ(url, {
    email,
    username,
    password,
  });

  return response;
};
