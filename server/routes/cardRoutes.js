import express from "express";
import {
  createCard,
  getCardsByList,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards
} from "../controllers/cardController.js";

const router = express.Router();

// Create card
router.post("/", createCard);

// Get cards in a list
router.get("/list/:listId", getCardsByList);

// Update card (title, description)
router.put("/:id", updateCard);

// Delete card
router.delete("/:id", deleteCard);

// Move card to another list
router.put("/move/:id", moveCard);

// Reorder cards inside a list
router.put("/reorder", reorderCards);

export default router;