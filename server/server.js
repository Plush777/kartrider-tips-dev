const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = 8000;
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* 카트 홈페이지 메뉴 - 가이드에 있는 게시글들 */
const GUIDE_URL =
  "https://kartdrift.nexon.com/kartdrift/ko/guide/gameguide/list";
/* 카트 홈페이지 메뉴 - 가이드 - 카트바디 도감 */
const KART_LIST_URL =
  "https://kartdrift.nexon.com/kartdrift/ko/guide/gameguide/view?threadId=2490274";
/* 카트 개발자노트 게시글 */
const DEV_NOTE_URL =
  "https://kartdrift.nexon.com/kartdrift/ko/news/announcement/list?searchKeywordType=THREAD_TITLE&keywords=%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%85%B8%ED%8A%B8";
/* 카트 업데이트 게시글 */
const UPDATE_URL = "https://kartdrift.nexon.com/kartdrift/ko/news/update/list";

/* 
    https://blog.ssogari.dev/25
    치지직에서 카트라이더 드리프트 검색했을 때 라이브 중인 유저 

    size: 반환할 결과의 수
    offset: 결과 목록의 시작점. (기본은 0부터 시작)
    ex) 전체 결과 개수가 10개라고 했을 때, 
    offset=1 => 9개의 결과만 가져옴
    offset=9 => 1개의 결과만 가져옴

    즉, 전체 개수에서 1씩 뺀다 생각하면 됨.
*/
const KART_LIVE_URL = `https://api.chzzk.naver.com/service/v1/search/lives?keyword=%EC%B9%B4%ED%8A%B8%EB%9D%BC%EC%9D%B4%EB%8D%94%20%EB%93%9C%EB%A6%AC%ED%94%84%ED%8A%B8`;

const NAVER_API_BASE_URL = "https://openapi.naver.com";

const NEWS_URL = `${NAVER_API_BASE_URL}/v1/search/news`;

const apiObject = {
  chzzk: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
    params: {
      chzzkParam: function (offset, size) {
        return {
          offset: offset,
          size: size,
        };
      },
    },
  },
  naver: {
    headers: {
      "Content-Type": "application/xml",
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    },
    search: {
      params: {
        search: function (query, display, start, sort, filter) {
          return {
            query: query,
            display: display,
            start: start,
            sort: sort,
            filter: filter,
          };
        },
      },
    },
  },
};

const naverApiHeader = apiObject.naver.headers;

const getData = async (url, headers, params) => {
  try {
    const response = await axios.get(url, {
      headers: headers,
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const blockResource = (page) => {
  page.setRequestInterception(true);
  page.on("request", (req) => {
    const resourceType = req.resourceType();
    if (["stylesheet", "font"].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });
};

const sharesUpDownCondition = (gameRankUpDown) => {
  if (gameRankUpDown > 0) return "up";
  if (gameRankUpDown < 0) return "down";
  if (gameRankUpDown === 0) return "noChange";
  return undefined;
};

const getHtml = async (url, resource, response, selector, condition) => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    let list = [];
    let object;
    let $bodyList = $(selector);

    if (condition === "kartdrift") {
      $bodyList.each(function (i, item) {
        if (i >= 4) return false;

        switch (resource) {
          case "news":
            object = {
              title: $(this).find(".tit span").text(),
              date: $(this).find(".info .date").text(),
              view: $(this).find(".view").text(),
            };
            break;
          case "guide":
          case "cm_event":
          case "dev":
          case "update":
            object = {
              title: $(this).find(".tit span").text(),
              date: $(this).find(".info .date").text(),
              view: $(this).find(".view").text(),
              url: `https://kartdrift.nexon.com${$(this)
                .find("a")
                .attr("href")}`,
            };

            break;
          default:
            break;
        }
        list[i] = object;
      });
    } else if (condition === "kart") {
      $bodyList.each(function (i, item) {
        let kartArray = [];

        $(this)
          .find(
            'tr td[style*="background-color:black"] span[style*="letter-spacing:-1.0pt"]'
          )
          .each(function (i, item) {
            kartArray.push($(this).text());
          });

        const kartArrayJoin = kartArray.join("");

        function extractItemsFromArray(str) {
          const regex = /\[[^\]]+\]\s*[^[]*/g;
          let results = str.match(regex) || [];
          return results;
        }

        const extractedItems = extractItemsFromArray(kartArrayJoin);
        const kartTypeSelector =
          'tr td[style*="background-color:#9a68f4"] span[style*="letter-spacing"], tr td[style*="background-color: rgb(154, 104, 244)"] span[style*="letter-spacing"], tr td[style*="background-color:#ee6060"] span[style*="letter-spacing"], tr td[style*="background-color:#6b72fb"] span[style*="letter-spacing"]';
        /* 
                    240630 주의사항 추가 
                    밸런스형 텍스트들의 background-color는 #9a68f4로 다 되어있는데,
                    스펙터만 혼자 rgb(154, 104, 244) 로 되어있어서 1개 누락되는 부분이 있으므로 rgb도 잘 봐야하고,
                    셀렉터 띄어쓰기도 잘 되어있는지 확인해야 함.
                */
        let kartTypeArray = [];

        $(this)
          .find(kartTypeSelector)
          .each(function (index) {
            let text = $(this).text();
            let matches = text.match(/밸런스형|속도형|드리프트형/g);
            if (matches) {
              kartTypeArray.push(...matches);
            }
          });

        let imgArray = [];

        $(this)
          .find("tr td img")
          .each(function (i, item) {
            // console.log(item.attribs.src);

            imgArray[i] = item.attribs.src;
          });

        let statArray = [];

        $(this)
          .find(
            'tr td:not([style*="background-color"]) span[style*="letter-spacing"]'
          )
          .each(function (i, item) {
            /* 정규식으로 0 ~ 9까지의 숫자만 가져옵니다. */
            let match = $(this).text().match(/\d+/g);

            /* 
                        null값이 아닌 값만 statArray에 넣는데
                        이 때, 값들은 문자열이기 때문에
                        map 메서드로 한번에 모든 값들을 숫자로 바꿉니다.
                    */
            if (match !== null) {
              statArray.push(...match.map(Number));
            }
          });

        /* 
                    카트바디 1개 당 수치는 총 4개이기 때문에,
                    for 문으로 statArray에 있는 모든 값들을 반복하면서
                    slice 메서드로 4개씩 자릅니다.

                    자른 값들을 결과값 저장하는 배열 안에 객체로 하나씩 각각 넣어줍니다.
                */
        let statResultArray = [];

        for (let i = 0; i < statArray.length; i += 4) {
          let sliceItem = statArray.slice(i, i + 4);
          statResultArray.push({ array: sliceItem });
        }

        object = {
          name: extractedItems,
          type: kartTypeArray,
          imgs: imgArray,
          stats: statResultArray,
        };
        list[i] = object;
      });
    } else if (condition === "ranking") {
      $bodyList.each(function (i, item) {
        object = {
          title: $(this).find(".game-name a").text(),
          rankChange: $(this).find(".rankChange").text(),
          rankStatus: $(this).find(".rankChange > span").attr("class"),
          rank: $(this).find(".rank").text(),
          img: $(this).find(".game-icon").attr("src"),
        };

        list[i] = object;
      });
    }

    response.json(list);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const getGameStatsData = async (cursor = 1) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });
  const page = await browser.newPage();

  const pageSize = 50;
  const loginUrl =
    "https://www.thelog.co.kr/member/loginForm.do?returnUrl=http://www.thelog.co.kr/stats/gameStats.do";
  const successUrl = "https://www.thelog.co.kr/stats/gameStats.do";
  const cursorApiUrl = `https://www.thelog.co.kr/api/service/getRealTimeRank.do?page=${cursor}&sort=game_rank&sortOption=ASC&gameDataType=A`;

  blockResource(page);

  const cookiesFilePath = "./cookies.json";

  const login = async () => {
    const myId = process.env.THE_LOG_MY_ID;
    const myPw = process.env.THE_LOG_MY_PASSWORD;

    await page.goto(loginUrl);
    await page.waitForSelector("#loginId");
    await page.type("#loginId", myId);
    await page.type("#loginPasswd", myPw);

    await Promise.all([
      page.click("input.btn_login"),
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    ]);

    if (page.url() !== successUrl) {
      console.error("로그인 실패");
      await browser.close();
      return false;
    }

    console.log("로그인 성공 후 쿠키 저장");
    const cookies = await page.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));

    await page.goto(successUrl);
  };

  if (fs.existsSync(cookiesFilePath)) {
    const cookieJson = fs.readFileSync(cookiesFilePath, "utf-8");
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);

    console.log("쿠키가 존재하므로 로그인 없이 이동");
    await page.goto(successUrl);

    if (page.url() === successUrl) {
      console.log("쿠키를 통해 로그인 성공");
    } else {
      console.log("쿠키 만료, 로그인 재시도");
      await login();
    }
  } else {
    console.log("쿠키가 없으므로 로그인 시도");
    await login();
  }

  const data = await page.evaluate(async (cursorApiUrl) => {
    try {
      const response = await fetch(cursorApiUrl);

      if (!response.ok) {
        console.error("API 호출 실패", response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch operation failed:", error);
      return null;
    }
  }, cursorApiUrl);

  const gameDataArray = data && data.realTimeRank;

  const cursorNumber = Number(cursor);
  const nextCursor = gameDataArray.length < pageSize ? null : cursorNumber + 1;

  const result = gameDataArray.map((_, index) => {
    const arrayIndex = gameDataArray[index];

    return {
      title: arrayIndex.gameName,
      rank: arrayIndex.gameRank,
      gameRankUpDown: arrayIndex.gameRankUpDown,
      shares: arrayIndex.gameShares,
      sharesStatus: sharesUpDownCondition(arrayIndex.gameRankUpDown),
      useStoreCount: arrayIndex.useStoreCount,
      targetDate: arrayIndex.targetDate,
    };
  });
  await browser.close();
  return { result, nextCursor };
};

async function generateUrl(page, mode, team, pointId) {
  const baseUrl = "https://kartdrift.nexon.com/kartdrift/ko/ranking/dayone";
  return `${baseUrl}?page=${page}&mode=${mode}&team=${team}&pointId=${pointId}`;
}

async function crawlRankingData({ mode, team, pointId, cursor = 1 }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });

  try {
    const page = await browser.newPage();
    const url = await generateUrl(cursor, mode, team, pointId);

    await page.goto(url, { waitUntil: "networkidle2" });
    blockResource(page);

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".board_list li")).map(
        (item) => ({
          rank:
            item.querySelector("[class*='do_n']")?.textContent.trim() ||
            undefined,
          name: item.querySelector(".do_tit")?.textContent.trim() || undefined,
          score: item.querySelector(".do_p")?.textContent.trim() || undefined,
        })
      );
    });

    return {
      result: data,
      nextCursor: data.length === 10 ? Number(cursor) + 1 : null,
      totalPages: 10,
    };
  } catch (error) {
    console.error("랭킹 데이터 크롤링 중 오류:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function getDayoneData(cursor = null) {
  // 기본 검색 파라미터 설정 (필요에 따라 수정)
  const defaultParams = {
    mode: "Item",
    team: "Solo",
    pointId: "dol.241124.itemsolo",
  };

  // 커서가 있는 경우 추가 로직 (필요하다면)
  const searchParams = cursor ? { ...defaultParams, cursor } : defaultParams;

  return await crawlRankingData(searchParams);
}

app.get("/api/article/:resource", (req, res) => {
  let { resource } = req.params;

  switch (resource) {
    case "guide":
      getHtml(
        GUIDE_URL,
        resource,
        res,
        ".board_list:not(.notice) ul li",
        "kartdrift"
      );
      break;
    case "dev":
      getHtml(
        DEV_NOTE_URL,
        resource,
        res,
        ".board_list:not(.notice) ul li",
        "kartdrift"
      );
      break;
    case "update":
      getHtml(
        UPDATE_URL,
        resource,
        res,
        ".board_list:not(.notice) ul li",
        "kartdrift"
      );
      break;
    default:
      res.status(404).json({ error: "Not Found" });
      break;
  }
});

app.get("/api/kart", (req, res) => {
  getHtml(KART_LIST_URL, null, res, ".MsoTableGrid[width]", "kart");
});

app.get("/api/chzzk/:info", async (req, res) => {
  let { info } = req.params;

  switch (info) {
    case "live":
      let offset = 0;
      let size = 3;

      const headers = apiObject.chzzk.headers;
      const params = apiObject.chzzk.params.chzzkParam(offset, size);

      if (req.query.offset) {
        offset = req.query.offset;
      }

      if (req.query.size) {
        size = req.query.size;
      }

      const liveData = await getData(KART_LIVE_URL, headers, params);

      res.json(liveData);
      break;
    default:
      res.status(404).json({ error: "Not Found" });
      break;
  }
});

app.get("/api/games/:source", async (req, res) => {
  let { source } = req.params;
  const cursor = req.query.cursor || null;

  try {
    switch (source) {
      case "ranking":
        console.log("Fetching mygame data...");

        const { result, nextCursor } = await getGameStatsData(cursor);

        req.app.locals.cachedGameData = { result, nextCursor };
        res.json({ result, nextCursor });

        break;

      /* === */

      case "news":
        const searchParams = apiObject.naver.search.params.search(
          "카트라이더 드리프트",
          4,
          1,
          "sim"
        );
        const news = await getData(NEWS_URL, naverApiHeader, searchParams);

        res.json(news);

        break;

      /* === */

      case "dayone":
        console.log("Fetching dayone data...");

        const { result: dayoneResult, nextCursor: dayoneNextCursor } =
          await getDayoneData(cursor);

        req.app.locals.cachedDayoneData = {
          result: dayoneResult,
          nextCursor: dayoneNextCursor,
        };
        res.json({ result: dayoneResult, nextCursor: dayoneNextCursor });

        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "요청 처리 도중 오류가 발생했습니다." });
  }
});

module.exports = app;
