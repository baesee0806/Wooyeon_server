import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.use((req, res, next) => {
  console.log("middleware for search!");
  next();
});

router.get("/aladin/book", async (req, res) => {
  const { bookName } = req.query;
  try {
    const data = await axios.get(
      `${process.env.ALADIN_ITEMSEARCH_URL}?ttbkey=${process.env.TTB_KEY}&SearchTarget=Book&output=js&Version=20131101&Query=${bookName}`
    );
    res.status(200).send(data.data.item);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/aladin/keyword", async (req, res) => {
  const { keyword } = req.query;

  try {
    const data = await axios.get(
      `${process.env.ALADIN_ITEMSEARCH_URL}?ttbkey=${process.env.TTB_KEY}&Query=${keyword}&SearchTarget=All&output=js&Version=20131101`
    );
    res.status(200).send(data.data.item);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/supabase/popularSearch", async (req, res) => {
  const { keyword } = req.query;
  try {
    const { data, error } = await supabase
      .from("PopularSearch")
      .select("*")
      .eq("keyword", keyword);
    if (error) throw error;
    return res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.put("/update/supabase/keyword", async (req, res) => {
  const { keyword } = req.query;
  let { count } = req.query;

  // count 값을 숫자로 변환
  count = Number(count);
  try {
    // 기존 검색어의 횟수 업데이트
    const { data, error } = await supabase
      .from("PopularSearch")
      .update({ search_count: count + 1 })
      .eq("keyword", keyword)
      .select();
    if (error) throw error;
    return res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/create/supabase/keywords", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("PopularSearch")
      .insert(req.body)
      .select();
    if (error) throw error;
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get(`/supabase/keywords`, async (req, res) => {
  try {
    let { data, error } = await supabase
      .from("PopularSearch")
      // select('*') 하면 안됨
      // db에서 몇개 가져올지 정함
      .select()
      .range(0, 8)
      // 숫자가 높은 순으로 가져옴
      .order("search_count", { ascending: false })
      // 최신 순으로 가져옴
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
