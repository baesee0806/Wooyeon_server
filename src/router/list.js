import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

router.use((req, res, next) => {
  console.log('middleware for list!');
  next();
});

router.get('/search', async (req, res) => {
  // const { query, sortType } = req.query;
  // try {
  //   // 첫번째 api
  //   const response = await axios.get(
  //     `${process.env.ALADIN_ITEMSEARCH_URL}?ttbkey=${process.env.TTB_KEY}&Query=${query}&QueryType=Keyword&MaxResults=30&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`
  //   );
  //   // 데이터의 item 속성만 추출
  //   const data = await response.data.item;
  //   // 해당 키워드 검색의 모든 데이터를 넣어줄 배열 (+ 첫 요청에서 가져온 30개 아이템)
  //   const allSearchData = [...data];
  //   // 해당 키워드 검색의 모든 아이템 개수
  //   const allSearchDataLength = await response.data.totalResults;
  //   // 해당 키워드 검색의 데이터 요청 수(한 번에 최대 50)
  //   const pageLength = Math.ceil(allSearchDataLength / 200);

  //   // 두 번째 요청부터 마지막 요청까지 데이터 누적
  //   for (let start = 2; start <= pageLength; start++) {
  //     const response = await axios.get(
  //       `${process.env.ALADIN_ITEMSEARCH_URL}?ttbkey=${process.env.TTB_KEY}&Query=${query}&QueryType=Keyword&MaxResults=50&start=${start}&SearchTarget=Book&output=js&Version=20131101&Cover=Big`
  //     );
  //     // for문을 순회하며 얻은 데이터
  //     const data = await response.data.item;
  //     // 끝까지 for문을 돌며 push
  //     allSearchData.push(...data);
  //   }

  //   // 중복 제거 로직 추가
  //   const uniqueItemsMap = new Map();
  //   allSearchData.forEach((item) => uniqueItemsMap.set(item.itemId, item));
  //   const uniqueAllSearchData = Array.from(uniqueItemsMap.values());

  //   // 해당 카테고리의 모든 데이터 정렬
  //   const sortedAllSearchData =
  //     sortType === "title"
  //       ? uniqueAllSearchData.sort((a, b) => a.title.localeCompare(b.title))
  //       : uniqueAllSearchData.sort(
  //           (a, b) =>
  //             new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  //         );

  //   res.status(200).send({ data: sortedAllSearchData });
  // } catch (err) {
  //   res.status(400).send(err);
  // }
  const { query, pageNum } = req.query;
  const start = Number(pageNum);

  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMSEARCH_URL}?ttbkey=${process.env.TTB_KEY}&Query=${query}&QueryType=Keyword&MaxResults=30&start=${start}&SearchTarget=Book&output=js&Version=20131101&Cover=Big`
    );
    // 신간리스트의 해당 카테고리 item만 추출해 data에 할당
    const data = await response.data.item;
    // 해당 카테고리 item의 총 갯수
    const dataLength = await response.data.totalResults;
    res.status(200).send({ data, dataLength });
  } catch (err) {
    res.status(400).send(err);
  }
});

// category 페이지 : 신간 전체 리스트 api
router.get('/newAll', async (req, res) => {
  // const { categoryId, sortType } = req.query;
  // try {
  //   // 첫번째 api
  //   const response = await axios.get(
  //     `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=ItemNewAll&MaxResults=24&start=1&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
  //   );
  //   // 데이터의 item 속성만 추출
  //   const data = await response.data.item;
  //   // 해당 카테고리의 모든 데이터를 넣어줄 배열 (+ 첫 요청에서 가져온 24개 아이템)
  //   const allCategoryData = [...data];
  //   // 해당 카테고리의 모든 아이템 개수
  //   const allCategoryDataLength = await response.data.totalResults;
  //   // 해당 카테고리의 데이터 요청 수(한 번에 최대 50)
  //   const pageLength = Math.ceil(allCategoryDataLength / 50);

  //   // 두 번째 요청부터 마지막 요청까지 데이터 누적
  //   for (let start = 2; start <= pageLength; start++) {
  //     const response = await axios.get(
  //       `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=ItemNewAll&MaxResults=50&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
  //     );
  //     // for문을 순회하며 얻은 데이터
  //     const data = await response.data.item;
  //     // 끝까지 for문을 돌며 push
  //     allCategoryData.push(...data);
  //   }

  //   // 중복 제거 로직 추가
  //   const uniqueItemsMap = new Map();
  //   allCategoryData.forEach((item) => uniqueItemsMap.set(item.itemId, item));
  //   const uniqueAllCategoryData = Array.from(uniqueItemsMap.values());

  //   // 해당 카테고리의 모든 데이터 정렬
  //   const sortedAllCategoryData =
  //     sortType === 'title'
  //       ? uniqueAllCategoryData.sort((a, b) => a.title.localeCompare(b.title))
  //       : uniqueAllCategoryData.sort(
  //           (a, b) =>
  //             new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  //         );
  //   // 데이터를 클라이언트 전송
  //   res.status(200).send({ data: sortedAllCategoryData });
  // } catch (err) {
  //   res.status(400).send(err);
  // }
  const { categoryId, pageNum } = req.query;
  const start = Number(pageNum);
  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=ItemNewAll&MaxResults=24&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
    );

    // 신간리스트의 해당 카테고리 item만 추출해 data에 할당
    const data = await response.data.item;
    // 해당 카테고리 item의 총 갯수
    const dataLength = await response.data.totalResults;
    res.status(200).send({ data, dataLength });
  } catch (err) {
    res.status(400).send(err);
  }
});

// new 페이지: 전체 신간 도서 api
router.get('/newSpecialAll', async (req, res) => {
  const { categoryId, pageNum } = req.query;
  // 추출한 page를 숫자로 변환(문자열로 넘어옴)해서 startIndex에 삽입(아이템 뿌려주는 시작 숫자)
  const start = Number(pageNum);

  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=ItemNewSpecial&MaxResults=30&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
    );

    const data = await response.data.item;
    const dataLength = await response.data.totalResults;
    res.status(200).send({ data, dataLength });
  } catch (err) {
    res.status(400).send(err);
  }
});

// best 페이지: 전체 베스트셀러 도서 api
router.get('/bestAll', async (req, res) => {
  const { categoryId, pageNum } = req.query;
  const start = Number(pageNum);

  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=Bestseller&MaxResults=24&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
    );

    const data = await response.data.item;
    res.status(200).send({ data });
  } catch (err) {
    res.status(400).send(err);
  }
});

// used 페이지: 전체 중고 도서 api
router.get('/usedAll', async (req, res) => {
  const { categoryId, pageNum } = req.query;
  const start = Number(pageNum);

  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=ItemNewAll&MaxResults=30&start=${start}&SearchTarget=Used&SubSearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`
    );
    const data = await response.data.item;
    const dataLength = await response.data.totalResults;
    res.status(200).send({ data, dataLength });
  } catch (err) {
    res.status(400).send(err);
  }
});

// used 페이지: 중고 베스트셀러 도서(5개) api
router.get('/usedBest', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ALADIN_ITEMLIST_URL}?ttbkey=${process.env.TTB_KEY}&QueryType=itemNewAll&MaxResults=50&start=1&SearchTarget=Used&SubSearchTarget=Book&output=js&Version=20131101&Cover=Big`
    );

    const data = await response.data.item
      // 중고도서 리스트의 item을 salesPoint 높은순 소팅
      .sort((a, b) => b.salesPoint - a.salesPoint)
      // 앞에서 6개만 추출
      .slice(0, 5);

    res.status(200).send({ usedBestData: data });
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
