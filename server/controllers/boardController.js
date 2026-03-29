import { supabase } from "../config/supabaseClient.js";

// Create Board
// Create Board
export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const { data, error } = await supabase
      .from("boards")
      .insert([{ title }])
      .select("*");  // <- explicit select

    if (error) throw error;

    console.log(data); // for debugging
    res.json(data[0]); // return first row
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Boards
export const getBoards = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .order("id");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Board (with lists + cards)
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .single();

    if (boardError) throw boardError;

    // Get lists
    const { data: lists, error: listError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", id)
      .order("position");

    if (listError) throw listError;

    // Get cards (join manually)
    const { data: cards, error: cardError } = await supabase
      .from("cards")
      .select(`
        *,
        lists!inner(board_id)
      `)
      .eq("lists.board_id", id)
      .order("position");

    if (cardError) throw cardError;

    res.json({
      board,
      lists,
      cards,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Board
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const { data, error } = await supabase
      .from("boards")
      .update({ title })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Board
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};