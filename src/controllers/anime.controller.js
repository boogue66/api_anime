import Anime from "../models/Anime.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createAnime = catchAsync(async (req, res, next) => {
  const newAnime = await Anime.create(req.body);
  res.status(201).json(newAnime);
});

export const getAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const options = {
    select: "title slug poster status genres last_episode -_id",
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: sortOrder },
  };
  const animes = await Anime.paginate({}, options);
  res.json(animes);
});

export const getAnimeBySlug = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);
  const skip = (pageInt - 1) * limitInt;
  const sortOrder = sort === "asc" ? 1 : -1;

  // Paso 1: Obtener el documento del anime sin los episodios para que la carga sea rápida.
  const anime = await Anime.findOne({ slug: req.params.slug }).select(
    "-episodes"
  );

  if (!anime) {
    return next(new AppError("Anime not found", 404));
  }

  // Paso 2: Usar un pipeline de agregación para obtener solo los episodios paginados y el conteo total.
  const results = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    {
      $project: {
        totalEpisodes: { $size: "$episodes" },
        // Ordenar los episodios en orden descendente antes de paginar
        // Asumiendo que 'episode' es el campo por el que quieres ordenar dentro de cada objeto de episodio
        sortedEpisodes: {
          $sortArray: { input: "$episodes", sortBy: { episode: sortOrder } },
        },
        _id: 0,
      },
    },
    {
      $project: {
        totalEpisodes: "$totalEpisodes",
        // Ahora aplicamos el slice al array ya ordenado
        paginatedEpisodes: { $slice: ["$sortedEpisodes", skip, limitInt] },
        _id: 0,
      },
    },
  ]);

  if (!results || results.length === 0) {
    return next(new AppError("Could not retrieve episodes.", 500));
  }

  const { totalEpisodes, paginatedEpisodes } = results[0];
  const totalPages = Math.ceil(totalEpisodes / limitInt);

  res.status(200).json({
    title: anime.title,
    slug: anime.url, // Assuming slug is url
    poster: anime.poster,
    status: anime.status,
    genres: anime.genres,
    last_episode: anime.last_episode,
    episodes: paginatedEpisodes,
    episodesPagination: {
      totalEpisodes,
      totalPages,
      currentPage: pageInt,
      hasNextPage: pageInt < totalPages,
      hasPrevPage: pageInt > 1,
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
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    select: "title url poster status last_episode -_id",
    sort: { updatedAt: sortOrder },
  };
  const animes = await Anime.paginate({ status: "Proximamente" }, options);
  res.json(animes);
});

export const getListFinishedAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: sortOrder },
  };
  const animes = await Anime.paginate({ status: "Finalizado" }, options);
  res.json(animes);
});

export const getListOnAirAnimes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: sortOrder },
  };
  const animes = await Anime.paginate({ status: "En emision" }, options);
  res.json(animes);
});

export const getListLatestEpisodes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { "episodes.updatedAt": sortOrder },
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
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const currentYear = new Date().getFullYear();
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: sortOrder },
    select: "title slug poster status",
  };
  const animes = await Anime.paginate(
    {
      status: "En emision",
      year: currentYear,
    },
    options
  );
  res.json(animes);
});

export const searchAnimes = catchAsync(async (req, res, next) => {
  const { query, page = 1, limit = 25, sort = "asc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { updatedAt: sortOrder },
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
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;

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
    sort: { updatedAt: sortOrder },
  };

  const animes = await Anime.paginate(query, options);
  res.json(animes);
});

export const getAnimeEpisodes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, sort = "desc" } = req.query;
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);
  const skip = (pageInt - 1) * limitInt;
  const sortOrder = sort === "asc" ? 1 : -1;

  const results = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    {
      $project: {
        totalEpisodes: { $size: "$episodes" },
        sortedEpisodes: {
          $sortArray: { input: "$episodes", sortBy: { episode: sortOrder } },
        },
        _id: 0,
      },
    },
    {
      $project: {
        totalEpisodes: "$totalEpisodes",
        paginatedEpisodes: { $slice: ["$sortedEpisodes", skip, limitInt] },
        _id: 0,
      },
    },
  ]);

  if (!results || results.length === 0) {
    return next(new AppError("Anime not found", 404));
  }

  const { totalEpisodes, paginatedEpisodes } = results[0];
  const totalPages = Math.ceil(totalEpisodes / limitInt);

  res.status(200).json({
    episodes: paginatedEpisodes,
    totalEpisodes,
    totalPages,
    currentPage: pageInt,
    hasNextPage: pageInt < totalPages,
    hasPrevPage: pageInt > 1,
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