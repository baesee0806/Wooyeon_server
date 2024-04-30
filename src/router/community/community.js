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
  console.log("middleware for community!");
  next();
});
router.get("/all/data", async (req, res) => {
  try {
    const alldata = [];
    alldata.push(supabase.from("bookReports").select("*"));
    alldata.push(supabase.from("bookMeetings").select("*"));
    alldata.push(supabase.from("bookSellings").select("*"));
    alldata.push(supabase.from("bookBuyings").select("*"));
    const data = await Promise.all(alldata);

    return res.status(200).send(data);
  } catch (err) {
    res.status(400).send;
  }
});
router.get("/:page", async (req, res) => {
  try {
    const { data } = await supabase.from(`${req.params.page}`).select("*");
    return res.status(200).send(data);
  } catch (err) {
    res.status(400).send;
  }
});
router.get("/detail/:page/:docid", async (req, res) => {
  try {
    const { data } = await supabase
      .from(`${req.params.page}`)
      .select("*")
      .eq("doc_id", req.params.docid);
    return res.status(200).send(data[0]);
  } catch (err) {
    res.status(400).send;
  }
});
router.post("/create/:page", async (req, res) => {
  const postData = req.body;

  const { data, error } = await supabase
    .from(`${req.params.page}`)
    .insert([postData]);

  if (error) {
    return res.status(400).send(error);
  }
  return res.status(200).send("success");
});
router.put("/update/:page/:docid", async (req, res) => {
  const updateData = req.body;
  const { data, error } = await supabase
    .from(`${req.params.page}`)
    .update(updateData)
    .eq("doc_id", req.params.docid)
    .select();

  if (error) {
    return res.status(400).send(error);
  }

  return res.status(200).send("success");
});

router.delete("/delete/:page", async (req, res) => {
  const deleteData = req.body;

  const { data, error } = await supabase
    .from(`${req.params.page}`)
    .delete()
    .eq("doc_id", deleteData.doc_id)
    .select();
  if (error) {
    return res.status(400).send(error);
  }

  return res.status(200).send("success");
});

export default router;
