import Anime from "../models/Anime.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createAnime = catchAsync(async (req, res, next) => {
  const newAnime = await Anime.create(req.body);
  res.status(201).json(newAnime);
});

export const getAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const options = {
    select: "title slug poster status genres last_episode -_id",
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: -1 },

  };
  const animes = await Anime.paginate({}, options);
  res.json(animes);
});

export const getAnimeBySlug = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const anime = await Anime.findOne({ slug: req.params.slug });
  if (!anime) {
    return next(new AppError("Anime not found", 404));
  }

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const endIndex = parseInt(page, 10) * parseInt(limit, 10);

  const paginatedEpisodes = anime.episodes.slice(startIndex, endIndex);

  const totalEpisodes = anime.episodes.length;
  const totalPages = Math.ceil(totalEpisodes / parseInt(limit, 10));

  res.status(200).json({
    ...anime.toObject(), // Convert Mongoose document to a plain JavaScript object
    episodes: paginatedEpisodes,
    episodesPagination: {
      totalEpisodes,
      totalPages,
      currentPage: parseInt(page, 10),
      hasNextPage: endIndex < totalEpisodes,
      hasPrevPage: startIndex > 0,
    },
  });
});

export const updateAnimeById = catchAsync(async (req, res, next) => {
  const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedAnime) {
    return next(new AppError("Anime not found", 404));
  }
  res.status(200).json(updatedAnime);
});

export const deleteAnimeById = catchAsync(async (req, res, next) => {
  const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
  if (!deletedAnime) {
    return next(new AppError("Anime not found", 404));
  }
  res.status(204).json();
});

export const getListComingSoonAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    select: "title url poster status last_episode -_id",
    sort: { updatedAt: -1 },
  };
  const animes = await Anime.paginate({ status: "Proximamente" }, options);
  res.json(animes);
});

export const getListFinishedAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
  const animes = await Anime.paginate({ status: "Finalizado" }, options);
  res.json(animes);
});

export const getListOnAirAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
  const animes = await Anime.paginate({ status: "En emision" }, options);
  res.json(animes);
});

export const getListLatestEpisodes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { "episodes.updatedAt": -1 },
    select: "title slug poster status ",
  };
  const animes = await Anime.paginate(
    {
      status: "En emision",
      "episodes.updatedAt": { $gte: twentyFourHoursAgo },
    },
    options
  );
  res.json(animes);
});

export const getListLatestAmimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const currentYear = new Date().getFullYear();
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: -1 },
    select: "title slug poster status",
  };
  const animes = await Anime.paginate(
    {
      status: "En emision",
      year: currentYear
    },
    options
  );
  res.json(animes);
});

export const searchAnimes = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const { page = 1, limit = 25 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: 1 },
  };
  const animes = await Anime.paginate(
    {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { alternative_titles: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    },
    options
  );
  res.json(animes);
});

export const filterAnimes = catchAsync(async (req, res, next) => {
  const { types, genres, statuses } = req.body;
  const { page = 1, limit = 25 } = req.query;

  const query = {};
  if (types && types.length > 0) {
    query.type = { $in: types };
  }
  if (genres && genres.length > 0) {
    query.genres = { $in: genres };
  }
  if (statuses && statuses.length > 0) {
    query.status = { $in: statuses };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const animes = await Anime.paginate(query, options);
  res.json(animes);
});

export const getAnimeEpisodes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25 } = req.query;
  const anime = await Anime.findOne({ slug: req.params.slug });
  if (!anime) {
    return next(new AppError("Anime not found", 404));
  }

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const endIndex = parseInt(page, 10) * parseInt(limit, 10);

  const paginatedEpisodes = anime.episodes.slice(startIndex, endIndex);

  const totalEpisodes = anime.episodes.length;
  const totalPages = Math.ceil(totalEpisodes / parseInt(limit, 10));

  res.status(200).json({
    episodes: paginatedEpisodes,
    totalEpisodes,
    totalPages,
    currentPage: parseInt(page, 10),
    hasNextPage: endIndex < totalEpisodes,
    hasPrevPage: startIndex > 0,
  });
});

export const getAnimeEpisodeServers = catchAsync(async (req, res, next) => {
  const anime = await Anime.findOne({ slug: req.params.slug });
  if (!anime) {
    return next(new AppError("Anime not found", 404));
  }
  const episode = anime.episodes.find(
    (e) => e.episode === parseInt(req.params.episode)
  );
  if (!episode) {
    return next(new AppError("Episode not found", 404));
  }
  res.status(200).json(episode.servers);
});
