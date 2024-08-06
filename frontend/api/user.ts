import { TODO_API_URL } from "@/lib/config";
import { LoginCredentials, User, UserResponse } from "@/types/User";
import axios, { AxiosResponse } from "axios";

// User authentication functions
export const signupUser = async (userData: User): Promise<AxiosResponse<UserResponse>> => {
  return axios.post<UserResponse>(`${TODO_API_URL}/auth/signup`, userData);
};

export const loginUser = async (credentials: LoginCredentials): Promise<AxiosResponse<UserResponse>> => {
  return axios.post<UserResponse>(`${TODO_API_URL}/auth/login`, credentials);
};

export const logoutUser = async (): Promise<AxiosResponse> => {
  // TODO: Pass credentials?
  return axios.get(`${TODO_API_URL}/auth/logout`);
};

// User profile functions
export const getOwnUserProfile = async (authToken: string): Promise<AxiosResponse<UserResponse>> => {
  return axios.get<UserResponse>(`${TODO_API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const updateOwnUserProfile = async (userData: User, authToken: string): Promise<AxiosResponse<UserResponse>> => {
  return axios.put<UserResponse>(`${TODO_API_URL}/user/update`, userData, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
