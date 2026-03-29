import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  updateBoard
} from "../controllers/boardController.js";

const router = express.Router();

// Create a new board
router.post("/", createBoard);

// Get all boards
router.get("/", getBoards);

// Get single board with ID
router.get("/:id", getBoardById);

// Update board title
router.put("/:id", updateBoard);

// Delete board
router.delete("/:id", deleteBoard);

export default router;