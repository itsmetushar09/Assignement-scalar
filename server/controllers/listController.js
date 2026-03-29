import { supabase } from "../config/supabaseClient.js";

// Create List
export const createList = async (req, res) => {
  try {
    const { title, board_id } = req.body;

    // Get next position
    const { data: existingLists, error: posError } = await supabase
      .from("lists")
      .select("position")
      .eq("board_id", board_id)
      .order("position", { ascending: false })
      .limit(1);

    if (posError) throw posError;

    const position = existingLists.length > 0
      ? existingLists[0].position + 1
      : 1;

    // Insert list
    const { data, error } = await supabase
      .from("lists")
      .insert([
        {
          title,
          board_id,
          position,
        },
      ])
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Lists by Board
export const getListsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", boardId)
      .order("position");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update List
export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const { data, error } = await supabase
      .from("lists")
      .update({ title })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete List
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("lists")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reorder Lists
export const reorderLists = async (req, res) => {
  try {
    const { lists } = req.body;

    const updates = lists.map((list) =>
      supabase
        .from("lists")
        .update({ position: list.position })
        .eq("id", list.id)
    );

    const results = await Promise.all(updates);

    for (let r of results) {
      if (r.error) throw r.error;
    }

    res.json({ message: "Lists reordered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};