import { getPublicUserById, loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
};

export const me = async (req, res) => {
  const user = await getPublicUserById(req.user.id);
  res.json({ user });
};

