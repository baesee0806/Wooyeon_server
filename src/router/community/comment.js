import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.use((req, res, next) => {
  console.log("middleware for comment!");
  next();
});

router.get("/detail/:doc_id", async (req, res) => {
  try {
    const { data } = await supabase
      .from("comment")
      .select("*")
      .eq("doc_id", req.params.doc_id);
    return res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/create/:doc_id", async (req, res) => {
  const postData = req.body;
  try {
    await supabase.from("comment").insert(postData).select();
    return res.status(200).send("success");
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/update/:doc_id", async (req, res) => {
  const putData = req.body;
  try {
    await supabase
      .from("comment")
      .update(putData)
      .eq("id", req.params.doc_id)
      .select();
    return res.status(200).send("success");
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/delete/:doc_id", async (req, res) => {
  try {
    await supabase
      .from("comment")
      .delete()
      .eq("id", req.params.doc_id)
      .select();
    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send(error);
  }
});
export default router;
