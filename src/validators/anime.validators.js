import Joi from "joi";


const episodeSchema = Joi.object({
  episode: Joi.number().required(),
  servers: Joi.array().items(
    Joi.object({
      server: Joi.string()
        .valid("Fembed", "MEGA", "Netu", "Okru", "Stape", "SW", "YourUpload")
        .required(),
      url: Joi.string().uri().required(),
    })
  ),
});

export const createAnimeSchema = Joi.object({
  title: Joi.string().required(),
  alternative_titles: Joi.array().items(Joi.string()),
  description: Joi.string(),
  url: Joi.string().uri().required(),
  poster: Joi.string().uri(),
  last_episode: Joi.number(),
  genres: Joi.array().items(Joi.string()),
  type: Joi.string(),
  year: Joi.number(),
  status: Joi.string().valid("Proximamente", "Finalizado", "En emision"),
  episodes: Joi.array().items(episodeSchema),
});

export const updateAnimeSchema = Joi.object({
  title: Joi.string(),
  alternative_titles: Joi.array().items(Joi.string()),
  description: Joi.string(),
  url: Joi.string().uri(),
  poster: Joi.string().uri(),
  last_episode: Joi.number(),
  genres: Joi.array().items(Joi.string()),
  type: Joi.string(),
  year: Joi.number(),
  status: Joi.string().valid("Proximamente", "Finalizado", "En emision"),
  episodes: Joi.array().items(episodeSchema),
});

export const filterAnimesSchema = Joi.object({
  types: Joi.array().items(Joi.string()),
  genres: Joi.array().items(Joi.string()),
  statuses: Joi.array().items(Joi.string().valid("Proximamente", "Finalizado", "En emision")),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});

export const searchSchema = Joi.object({
  query: Joi.string().required(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});

export const idSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

export const slugSchema = Joi.object({
  slug: Joi.string().required(),
});

export const episodeParamsSchema = Joi.object({
  slug: Joi.string().required(),
  episode: Joi.number().integer().min(1).required(),
});
