const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};
