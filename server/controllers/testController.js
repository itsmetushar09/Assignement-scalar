import { supabase } from "../config/supabaseClient.js";

export const testDB = async (req, res) => {
  try {
    // Try fetching boards table
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      message: "✅ Database connected successfully",
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Database connection failed",
      error: err.message,
    });
  }
};