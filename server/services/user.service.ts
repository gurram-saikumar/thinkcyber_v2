import { User } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../utils/catchAsyncError";

// get user by id
export const getUserById = catchAsyncError(async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  return user;
});

// get all users
export const getAllUsers = catchAsyncError(async () => {
  const users = await User.findAll();
  return users;
});

// update user role
export const updateUserRole = catchAsyncError(async (id: string, role: string) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  user.role = role;
  await user.save();
  return user;
});

// delete user
export const deleteUser = catchAsyncError(async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  await user.destroy();
  return { message: "User deleted successfully" };
});