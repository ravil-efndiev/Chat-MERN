import { Response } from "express";

export function usernameValid(username: string, res: Response): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  if (username === "") {
    res.status(400).json({error: "Username cannot be empty"});
    return false;
  }
  if (!regex.test(username)) {
    res.status(400).json({error: "Username must only contain letters and numbers"});
    return false
  }
  if (username.length > 25) {
    res.status(400).json({error: "Username is too long"});
    return false;
  }
  return true;
}

export function passwordValid(password: string, res: Response): boolean {
  const regex = /^[^\s]+$/;
  if (!regex.test(password)) {
    res.status(400).json({error: "Password must not contain any spaces"});
    return false;
  }
  if (password.length < 8) {
    res.status(400).json({error: "Password must be at least 8 characters long"});
    return false;
  }
  if (password.length > 100) {
    res.status(400).json({error: "Password is too long"});
  }
  return true;
}

export function validateAndTrimFullname(fullName: string, res: Response): string | null {
  if (fullName === "") {
    res.status(400).json({error: "Full name cannot be empty"});
    return null;
  }

  const trimmed = fullName.trim();
  if (trimmed.length > 50) {
    res.status(400).json({error: "Full name is too long"});
    return null;
  }
  return trimmed;
}
