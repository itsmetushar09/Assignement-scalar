import express from "express";
import {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
  reorderLists
} from "../controllers/listController.js";

const router = express.Router();

// Create a list
router.post("/", createList);

// Get all lists of a board
router.get("/board/:boardId", getListsByBoard);

// Update list title
router.put("/:id", updateList);

// Delete list
router.delete("/:id", deleteList);

// Reorder lists (drag & drop)
router.put("/reorder", reorderLists);

export default router;