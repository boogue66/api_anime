import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.paginate({}, req.paginationOptions); // Using paginate and paginationOptions

  res.status(200).json({
    status: 'success',
    results: users.docs.length, // For paginated results
    data: {
      users: users.docs, // For paginated results
      totalDocs: users.totalDocs,
      limit: users.limit,
      page: users.page,
      totalPages: users.totalPages,
      hasNextPage: users.hasNextPage,
      hasPrevPage: users.hasPrevPage,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getUserEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    return next(new AppError('No se encontró usuario con ese email', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});