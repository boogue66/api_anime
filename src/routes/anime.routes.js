import { Router } from "express";
import * as animeCtrl from "../controllers/anime.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createAnimeSchema, updateAnimeSchema, filterAnimesSchema, paginationSchema, searchSchema, idSchema, episodeParamsSchema,
} from "../validators/anime.validators.js";

const router = Router();
//* Routes for Anime *//
router.get(
  "/",
  validate(paginationSchema, "query"),
  animeCtrl.getAnimes
);

router.get(
  "/:slug",
  validate(idSchema, "params"),
  animeCtrl.getAnimeBySlug
);
router.get(
  "/:slug/episodes",
  validate(idSchema, "params"),
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
  animeCtrl.getListComingSoonAnimes
);
router.get(
  "/list/finished",
  validate(paginationSchema, "query"),
  animeCtrl.getListFinishedAnimes
);
router.get(
  "/list/on-air",
  validate(paginationSchema, "query"),
  animeCtrl.getListOnAirAnimes
);
router.get(
  "/list/latest-episodes",
  validate(paginationSchema, "query"),
  animeCtrl.getListLatestEpisodes
);
router.get(
  "/list/latest-animes",
  validate(paginationSchema, "query"),
  animeCtrl.getListLatestAmimes
);

//* Search *//
router.get("/search", validate(searchSchema, "query"), animeCtrl.searchAnimes);
router.post(
  "/search/by-filter",
  validate(filterAnimesSchema, "body"),
  validate(paginationSchema, "query"),
  animeCtrl.filterAnimes
);


//* CRUD *//
router.post("/new", validate(createAnimeSchema, "body"), animeCtrl.createAnime);
router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(updateAnimeSchema, "body"),
  animeCtrl.updateAnimeById
);
router.delete("/:id", validate(idSchema, "params"), animeCtrl.deleteAnimeById);

export default router;
