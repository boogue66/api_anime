import Anime from "../models/Anime.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { ANIME_STATUS } from "../utils/constants.js"; // Added import

export const createAnime = catchAsync(async (req, res, next) => {
  const newAnime = await Anime.create(req.body);
  res.status(201).json(newAnime);
});

export const getAnimes = catchAsync(async (req, res, next) => {
  const options = {
    select: "title slug description poster status genres last_episode -_id",
    ...req.paginationOptions,
  };
  const animes = await Anime.paginate({}, options);
  res.json(animes);
});

export const getAnimeBySlug = catchAsync(async (req, res, next) => {
  const { page, limit, sort } = req.paginationOptions;
  const pageInt = page;
  const limitInt = limit;
  const skip = (pageInt - 1) * limitInt;
  const sortOrder = sort.updatedAt;
  const [animeDetails] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    {
      $project: {
        title: 1,
        slug: 1,
        poster: 1,
        status: 1,
        genres: 1,
        last_episode: 1,
        description: 1,
        _id: 0,
      },
    },
  ]);

  if (!animeDetails) {
    return next(new AppError("Anime not found", 404));
  }

  const [episodesData] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    { $unwind: "$episodes" },
    { $sort: { "episodes.episode": sortOrder } },
    { $skip: skip },
    { $limit: limitInt },
    {
      $group: {
        _id: "$_id",
        paginatedEpisodes: { $push: "$episodes" },
      },
    },
    {
      $project: {
        _id: 0,
        paginatedEpisodes: 1,
      },
    },
  ]);

  const [totalEpisodesCount] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    { $project: { totalEpisodes: { $size: "$episodes" }, _id: 0 } },
  ]);

  const totalEpisodes = totalEpisodesCount ? totalEpisodesCount.totalEpisodes : 0;
  const paginatedEpisodes = episodesData ? episodesData.paginatedEpisodes : [];
  const totalPages = Math.ceil(totalEpisodes / limitInt);

  res.status(200).json({
    title: animeDetails.title,
    slug: animeDetails.slug,
    description: animeDetails.description,
    poster: animeDetails.poster,
    status: animeDetails.status,
    genres: animeDetails.genres,
    last_episode: animeDetails.last_episode,
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
  const options = {
    select: "title url poster status last_episode -_id",
    ...req.paginationOptions,
  };
  const animes = await Anime.paginate({ status: ANIME_STATUS.COMING_SOON }, options);
  res.json(animes);
});

export const getListOnAirAnimes = catchAsync(async (req, res, next) => {
  const options = {
    select: "title slug description poster status genres last_episode -_id",
    ...req.paginationOptions,
  };
  const animes = await Anime.paginate({ status: ANIME_STATUS.ON_AIR }, options);
  res.json(animes);
});

export const getLatestEpisodes = catchAsync(async (req, res, next) => { // Renamed from getRecentlyUpdatedAnimes
  const options = {
    ...req.paginationOptions,
    select: "title slug description poster status genres last_episode -_id",
    // No status filter here, as it should be all animes with latest updated episodes
  };
  const animes = await Anime.paginate({}, options); // Sort by updatedAt is already in req.paginationOptions.sort
  res.json(animes);
});

export const getLatestAnimes = catchAsync(async (req, res, next) => { // New function
  const options = {
    select: "title slug description poster status genres last_episode -_id",
    ...req.paginationOptions,
    sort: { createdAt: req.paginationOptions.sort.updatedAt }, // Sort by createdAt
  };
  const animes = await Anime.paginate({}, options);
  res.json(animes);
});

export const searchAnimes = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const options = {
    select: "title slug description poster status genres last_episode -_id",
    ...req.paginationOptions,
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
  const options = {
    select: "title slug description poster status genres last_episode -_id",
    ...req.paginationOptions,
  };

  const query = {};
  if (types && types.length > 0) {
    query.type = { $in: types };
  }
  if (genres && genres.length > 0) {
    query.genres = { $in: genres };
  }
  if (statuses && statuses.length > 0) {
    query.status = { $in: statuses.map(s => ANIME_STATUS[s]) }; // Used constant
  }

  const animes = await Anime.paginate(query, options);
  res.json(animes);
});

export const getAnimeEpisodes = catchAsync(async (req, res, next) => {
  const { page, limit, sort } = req.paginationOptions;
  const pageInt = page;
  const limitInt = limit;
  const skip = (pageInt - 1) * limitInt;
  const sortOrder = sort.updatedAt;

  const [episodesData] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    { $unwind: "$episodes" },
    { $sort: { "episodes.episode": sortOrder } },
    { $skip: skip },
    { $limit: limitInt },
    {
      $group: {
        _id: "$_id",
        paginatedEpisodes: { $push: "$episodes" },
      },
    },
    {
      $project: {
        _id: 0,
        paginatedEpisodes: 1,
      },
    },
  ]);

  const [totalEpisodesCount] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    { $project: { totalEpisodes: { $size: "$episodes" }, _id: 0 } },
  ]);

  const totalEpisodes = totalEpisodesCount ? totalEpisodesCount.totalEpisodes : 0;
  const paginatedEpisodes = episodesData ? episodesData.paginatedEpisodes : [];
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
  const [result] = await Anime.aggregate([
    { $match: { slug: req.params.slug } },
    { $unwind: "$episodes" },
    { $match: { "episodes.episode": parseInt(req.params.episode) } },
    { $project: { servers: "$episodes.servers", _id: 0 } }
  ]);

  if (!result || !result.servers) {
    return next(new AppError("Episode or servers not found", 404));
  }

  res.status(200).json(result.servers);
});