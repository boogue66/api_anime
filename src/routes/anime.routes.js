import { Router } from "express";
import * as animeCtrl from "../controllers/anime.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { paginate } from "../utils/pagination.js";
import {
  createAnimeSchema,
  updateAnimeSchema,
  filterAnimesSchema,
  paginationSchema,
  searchSchema,
  idSchema,
  slugSchema,
  episodeParamsSchema,
} from "../validators/anime.validators.js";
import { protect } from "../middlewares/protect.middleware.js";

const router = Router();
//* Routes for Anime *//
router.get(
  "/",
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.getAnimes
);

//* Search *//
router.get(
  "/search",
  validate(searchSchema, "query"),
  paginate,
  animeCtrl.searchAnimes
);
router.post(
  "/search/by-filter",
  validate(filterAnimesSchema, "body"),
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.filterAnimes
);

router.get(
  "/:slug",
  validate(slugSchema, "params"),
  paginate,
  animeCtrl.getAnimeBySlug
);
router.get(
  "/:slug/episodes",
  validate(slugSchema, "params"),
  paginate,
  animeCtrl.getAnimeEpisodes
);
router.get(
  "/:slug/episodes/:episode",
  validate(episodeParamsSchema, "params"),
  animeCtrl.getAnimeEpisodeServers
);
//*Listas *//
router.get(
  "/list/coming-soon",
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.getListComingSoonAnimes
);
router.get(
  "/list/on-air",
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.getListOnAirAnimes
);
router.get(
  "/list/latest-episodes", // Updated route name
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.getLatestEpisodes // Updated controller function
);
router.get(
  "/list/latest-animes", // New route
  validate(paginationSchema, "query"),
  paginate,
  animeCtrl.getLatestAnimes // New controller function
);


//* CRUD *//
router.post("/new", protect, validate(createAnimeSchema, "body"), animeCtrl.createAnime);
router.put(
  "/:id",
  protect,
  validate(idSchema, "params"),
  validate(updateAnimeSchema, "body"),
  animeCtrl.updateAnimeById
);
router.delete("/:id", protect, validate(idSchema, "params"), animeCtrl.deleteAnimeById);

export default router;