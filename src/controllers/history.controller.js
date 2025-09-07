import History from '../models/History.js';
import User from '../models/User.js';
import Anime from '../models/Anime.js'; // Added
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const history = await History.find({ userId }).populate({
    path: 'animeId',
  });

  const historyWithAnime = history.map(entry => {
    const historyObject = entry.toObject();
    if (historyObject.animeId) {
      historyObject.anime = {
        slug: historyObject.animeId.slug,
        title: historyObject.animeId.title,
        poster: historyObject.animeId.poster,
        synopsis: historyObject.animeId.description,
        genres: historyObject.animeId.genres,
      };
      delete historyObject.animeId;
    }
    return historyObject;
  });

  res.status(200).json({
    status: 'success',
    results: historyWithAnime.length,
    data: {
      history: historyWithAnime,
    },
  });
});

export const updateAnimeHistory = catchAsync(async (req, res, next) => {
  const { userId, animeSlug } = req.params; // Changed to animeSlug
  const { status, episodesWatched, lastEpisode } = req.body;

  const anime = await Anime.findOne({ slug: animeSlug }); // Find anime by slug
  if (!anime) {
    return next(new AppError('Anime not found', 404));
  }

  // Find the history entry for the user and anime
  const history = await History.findOne({ userId: userId, animeId: anime._id }); // Use anime._id

  if (!history) {
    return next(new AppError('History entry not found for this user and anime', 404));
  }

  // Update the history entry
  if (status) history.status = status;
  if (episodesWatched) history.episodesWatched = episodesWatched;
  if (lastEpisode) history.lastEpisode = lastEpisode;

  await history.save();

  res.status(200).json({
    status: 'success',
    data: {
      history,
    },
  });
});

export const getAnimeHistory = catchAsync(async (req, res, next) => {
  const { userId, animeSlug } = req.params; // Changed to animeSlug

  const anime = await Anime.findOne({ slug: animeSlug }); // Find anime by slug
  if (!anime) {
    return next(new AppError('Anime not found', 404));
  }

  const history = await History.findOne({ userId: userId, animeId: anime._id }); // Use anime._id

  if (!history) {
    return next(new AppError('History entry not found for this user and anime', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      history,
    },
  });
});

export const deleteAnimeFromHistory = catchAsync(async (req, res, next) => {
  const { userId, animeSlug } = req.params; // Changed to animeSlug

  const anime = await Anime.findOne({ slug: animeSlug }); // Find anime by slug
  if (!anime) {
    return next(new AppError('Anime not found', 404));
  }

  const history = await History.findOneAndDelete({ userId: userId, animeId: anime._id }); // Use anime._id

  if (!history) {
    return next(new AppError('History entry not found for this user and anime', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const addAnimeToHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.params;       // viene de la URL
  const { animeSlug, status } = req.body; // Corrected destructuring

  // Verificar que el usuario exista
  const user = await User.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  const anime = await Anime.findOne({ slug: animeSlug }); // Find anime by slug
  if (!anime) {
    return next(new AppError('Anime not found', 404));
  }

  // Crear el historial combinando params y body
  const newHistory = new History({
    userId,       // ⚠ importante
    animeId: anime._id,      // ⚠ importante: Use anime._id
    status,
    episodesWatched: [],
    lastEpisode: 0
  });

  await newHistory.save();

  // Add slug to the response
  const historyWithSlug = { ...newHistory.toObject(), slug: anime.slug };

  res.status(201).json({
    status: 'success',
    data: { history: historyWithSlug }
  });
});