// import express from "express";
import { testDB } from "../controllers/testController.js";

const router = express.Router();

import express from "express";
import { supabase } from "../config/supabaseClient.js"; // ✅ FIXED

// const router = express.Router();

router.get("/test", async (req, res) => {
  const { data, error } = await supabase
    .from("boards")
    .select("*");

  if (error) {
    return res.json({ success: false, error });
  }

  res.json({ success: true, data });
});



export default router;