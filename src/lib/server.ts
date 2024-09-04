import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
});

interface UserData {
  id?: number;
  name: string;
  email: string;
}

interface User extends UserData {
  id: number;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<UserData[]>("/users");
  return response.data.map((user) => ({
    id: user.id ?? 0,
    name: user.name,
    email: user.email,
  }));
};
// Create a new user
export const createUser = async (userData: UserData) => {
  const response = await apiClient.post<UserData>("/users", userData);
  return response.data;
};

// Update an existing user
export const updateUser = async (userId: number, userData: UserData) => {
  const response = await apiClient.put<UserData>(`/users/${userId}`, userData);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId: number) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};
