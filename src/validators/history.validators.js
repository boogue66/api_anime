import Joi from 'joi';
import { validate } from '../middlewares/validator.middleware.js';

const addAnimeToHistorySchema = Joi.object({
  animeSlug: Joi.string().required().messages({
    'string.empty': 'Anime slug is required',
    'any.required': 'Anime slug is required',
  }),
  status: Joi.string().valid('watching', 'completed', 'planned').messages({
    'any.only': 'Status must be one of watching, completed, or planned',
  }),
});

const updateAnimeHistorySchema = Joi.object({
  status: Joi.string().valid('watching', 'completed').messages({
    'any.only': 'Status must be one of watching or completed',
  }),
  episodesWatched: Joi.array().items(Joi.number().integer().min(0)),
  lastEpisode: Joi.number().integer().min(0),
}).min(1); // At least one field is required for update

export const addAnimeToHistoryValidation = validate(addAnimeToHistorySchema, 'body');
export const updateAnimeHistoryValidation = validate(updateAnimeHistorySchema, 'body');