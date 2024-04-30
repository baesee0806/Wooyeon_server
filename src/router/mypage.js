import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.use((req, res, next) => {
  console.log("middleware for mypage!");
  next();
});

router.get("/my/like", async (req, res) => {
  const { user_id } = req.query;

  try {
    const { data: bookReport } = await supabase.from("bookReport").select("*");
    const bookReportData = bookReport.filter((item) =>
      item.like_users.includes(user_id)
    );
    const { data: bookMeeting } = await supabase
      .from("bookMeeting")
      .select("*");
    const bookMeetingData = bookMeeting.filter((item) =>
      item.like_users.includes(user_id)
    );
    const { data: bookSelling } = await supabase
      .from("bookSelling")
      .select("*");
    const bookSellingData = bookSelling.filter((item) =>
      item.like_users.includes(user_id)
    );
    const { data: bookBuying } = await supabase.from("bookBuying").select("*");
    const bookBuyingData = bookBuying.filter((item) =>
      item.like_users.includes(user_id)
    );

    const data = [
      ...bookReportData,
      ...bookMeetingData,
      ...bookSellingData,
      ...bookBuyingData,
    ];

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/my/post", async (req, res) => {
  const { page, userId, sort, categories } = req.query;

  try {
    // 기본적으로 사용자가 생성한 모든 데이터를 조회
    let query = supabase.from(`${page}`).select("*").eq("created_user", userId);

    // 카테고리에 따른 필터링 적용 (팝니다)
    if (page === "bookSelling") {
      if (categories === "true") {
        query = query.eq("selling", true);
      } else if (categories === "false") {
        query = query.eq("selling", false);
      }
    }

    if (page === "bookMeeting") {
      if (categories === "true") {
        query = query.eq("state", false); // 모집중
      } else if (categories === "false") {
        query = query.eq("state", true); // 모집완료
      }
    }

    // 필터링 적용된 데이터 조회
    let { data, error } = await query;

    if (error) {
      throw error;
    }

    // 정렬 로직
    switch (sort) {
      case "Latest":
        data = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "Like":
        data = data.sort((a, b) => {
          const lengthA = a.like_users ? a.like_users.length : 0;
          const lengthB = b.like_users ? b.like_users.length : 0;
          return lengthB - lengthA; // 내림차순 정렬
        });
        break;
      case "View":
        data = data.sort((a, b) => b.view - a.view);
        break;
      default:
        data = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    // 페이지네이션 적용된 데이터 조회
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
export default router;
