import { supabase } from "../config/supabaseClient.js";

// Create Card
export const createCard = async (req, res) => {
  try {
    const { title, description, list_id } = req.body;

    // Get next position
    const { data: existingCards, error: posError } = await supabase
      .from("cards")
      .select("position")
      .eq("list_id", list_id)
      .order("position", { ascending: false })
      .limit(1);

    if (posError) throw posError;

    const position = existingCards.length > 0
      ? existingCards[0].position + 1
      : 1;

    // Insert card
    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          title,
          description: description || "",
          list_id,
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

// Get Cards by List
export const getCardsByList = async (req, res) => {
  try {
    const { listId } = req.params;

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", listId)
      .order("position");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Card
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const { data, error } = await supabase
      .from("cards")
      .update({ title, description })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Card
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Move Card (between lists)
export const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { newListId } = req.body;

    // Get next position in new list
    const { data: existingCards, error: posError } = await supabase
      .from("cards")
      .select("position")
      .eq("list_id", newListId)
      .order("position", { ascending: false })
      .limit(1);

    if (posError) throw posError;

    const newPosition = existingCards.length > 0
      ? existingCards[0].position + 1
      : 1;

    // Update card
    const { data, error } = await supabase
      .from("cards")
      .update({
        list_id: newListId,
        position: newPosition,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reorder Cards
export const reorderCards = async (req, res) => {
  try {
    const { cards } = req.body;

    // Update all cards one by one (Supabase has no BEGIN/COMMIT here)
    const updates = cards.map((card) =>
      supabase
        .from("cards")
        .update({ position: card.position })
        .eq("id", card.id)
    );

    const results = await Promise.all(updates);

    // Check errors
    for (let r of results) {
      if (r.error) throw r.error;
    }

    res.json({ message: "Cards reordered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};