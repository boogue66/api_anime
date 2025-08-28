import { Router } from "express";
import * as historyCtrl from "../controllers/history.controller.js";
import { addAnimeToHistoryValidation, updateAnimeHistoryValidation } from "../validators/history.validators.js";

const router = Router();

router.post(
  '/:userId/history',
  addAnimeToHistoryValidation,
  historyCtrl.addAnimeToHistory
);
router.get('/:userId/history', historyCtrl.getHistory);

router
  .route('/:userId/history/:animeSlug')
  .get(historyCtrl.getAnimeHistory)
  .patch(updateAnimeHistoryValidation, historyCtrl.updateAnimeHistory)
  .delete(historyCtrl.deleteAnimeFromHistory);

export default router;