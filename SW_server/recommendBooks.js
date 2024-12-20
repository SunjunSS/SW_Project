const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const axios = require("axios");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sw_project",
  port: 443,
};

const ALADIN_TTB_KEY = process.env.ALADIN_API_KEY;
const ALADIN_API_URL = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx";

// 작가 이름 정리 함수
function cleanAuthorName(author) {
  if (!author) return "";

  // 작가 이름에서 제거할 패턴들
  const removePatterns = [
    /\s*지은이\s*/g,
    /\s*엮은이\s*/g,
    /\s*옮긴이\s*/g,
    /\s*글쓴이\s*/g,
    /\s*저자\s*/g,
    /\s*저\s*/g,
    /\s*편저\s*/g,
    /\s*편집\s*/g,
    /\s*감수\s*/g,
    /\s*역자\s*/g,
    /\s*번역\s*/g,
    /\s*\([^)]*\)/g,  // 괄호와 그 안의 내용 제거
    /\s*（[^）]*）/g,  // 전각 괄호와 그 안의 내용 제거
    /\s*\[[^\]]*\]/g,  // 대괄호와 그 안의 내용 제거
    /\s*［[^］]*］/g,  // 전각 대괄호와 그 안의 내용 제거
  ];

  let cleanedName = author;

  // 모든 패턴 적용
  removePatterns.forEach(pattern => {
    cleanedName = cleanedName.replace(pattern, '');
  });

  // 앞뒤 공백 제거 및 연속된 공백을 하나로
  cleanedName = cleanedName.trim().replace(/\s+/g, ' ');

  // 쉼표로 구분된 경우 첫 번째 저자만 사용
  if (cleanedName.includes(',')) {
    cleanedName = cleanedName.split(',')[0].trim();
  }

  // 세미콜론으로 구분된 경우 첫 번째 저자만 사용
  if (cleanedName.includes(';')) {
    cleanedName = cleanedName.split(';')[0].trim();
  }

  return cleanedName;
}

// 도서 추천 알고리즘 (작가, 제목, 장르 기반)
async function searchRecommendedBooks(authors, titles, genres, excludedTitles) {
  const recommendedBooks = new Set();
  const processedAuthors = new Set();
  const processedGenres = new Set();
  const processedTitles = new Set();

  // 1. 작가 기반 추천
  for (const author of authors) {
    const cleanedAuthor = cleanAuthorName(author);
    if (processedAuthors.has(cleanedAuthor)) continue;
    processedAuthors.add(cleanedAuthor);

    try {
      const authorResponse = await axios.get(ALADIN_API_URL, {
        params: {
          TTBKey: ALADIN_TTB_KEY,
          Query: cleanedAuthor,
          QueryType: "Author",
          start: 1,
          MaxResults: 5,
          SearchTarget: "Book",
          output: "js",
          Sort: "Accuracy",
          Version: "20131101",
          RecentPublishFilter: 10
        },
      });

      const authorBooks = (authorResponse.data.item || [])
        .filter(book => book && book.title)
        .filter(book => !excludedTitles.includes(book.title))
        .filter(book => book.price !== 0)
        .slice(0, 3); // 작가당 최대 3권

      for (const book of authorBooks) {
        if (recommendedBooks.size < 10) {
          const recommendedBook = {
            title: book.title,
            author: cleanAuthorName(book.author),
            genre: book.genre || '미분류',
            cover: book.cover,
            link: book.link,
            price: book.priceSales || book.pricesales || 0,
            recommendationType: 'author'
          };
          recommendedBooks.add(recommendedBook);
        }
      }
    } catch (error) {
      console.error(`작가 ${cleanedAuthor} 검색 오류:`, error.message);
    }
  }

  // 2. 제목 기반 추천
  for (const title of titles) {
    if (processedTitles.has(title)) continue;
    processedTitles.add(title);

    try {
      const titleResponse = await axios.get(ALADIN_API_URL, {
        params: {
          TTBKey: ALADIN_TTB_KEY,
          Query: title,
          QueryType: "Title",
          start: 1,
          MaxResults: 5,
          SearchTarget: "Book",
          output: "js",
          Sort: "Accuracy",
          Version: "20131101",
          RecentPublishFilter: 10
        },
      });

      const titleBooks = (titleResponse.data.item || [])
        .filter(book => book && book.title)
        .filter(book => !excludedTitles.includes(book.title))
        .filter(book => book.price !== 0)
        .slice(0, 3); // 제목당 최대 3권

      for (const book of titleBooks) {
        if (recommendedBooks.size < 10) {
          const recommendedBook = {
            title: book.title,
            author: cleanAuthorName(book.author),
            genre: book.genre || '미분류',
            cover: book.cover,
            link: book.link,
            price: book.priceSales || book.pricesales || 0,
            recommendationType: 'title'
          };
          recommendedBooks.add(recommendedBook);
        }
      }
    } catch (error) {
      console.error(`제목 ${title} 검색 오류:`, error.message);
    }
  }

  // 3. 장르 기반 추천
  for (const genre of genres) {
    if (processedGenres.has(genre)) continue;
    processedGenres.add(genre);

    try {
      const genreResponse = await axios.get(ALADIN_API_URL, {
        params: {
          TTBKey: ALADIN_TTB_KEY,
          Query: genre,
          QueryType: "genre",
          start: 1,
          MaxResults: 5,
          SearchTarget: "Book",
          output: "js",
          Sort: "Accuracy",
          Version: "20131101",
          RecentPublishFilter: 10
        },
      });

      const genreBooks = (genreResponse.data.item || [])
        .filter(book => book && book.title)
        .filter(book => !excludedTitles.includes(book.title))
        .filter(book => book.price !== 0)
        .slice(0, 3); // 장르당 최대 3권

      for (const book of genreBooks) {
        if (recommendedBooks.size < 10) {
          const recommendedBook = {
            title: book.title,
            author: cleanAuthorName(book.author),
            genre: book.genre || '미분류',
            cover: book.cover,
            link: book.link,
            price: book.priceSales || book.pricesales || 0,
            recommendationType: 'genre'
          };
          recommendedBooks.add(recommendedBook);
        }
      }
    } catch (error) {
      console.error(`장르 ${genre} 검색 오류:`, error.message);
    }
  }

  // 최종 추천 목록 반환 (최대 10권)
  const recommendations = Array.from(recommendedBooks).slice(0, 10);
  console.log("최종 추천 도서 목록:", recommendations);

  return recommendations;
}

// 도서 추천 라우터
router.get("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("받은 유저 id: ", userId);

  if (!userId) {
    console.error("유저 정보 전달 안됨");
    return res.status(400).json({
      success: false,
      message: "사용자 ID가 전달되지 않았습니다.",
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [userBooks] = await connection.execute(
      "SELECT title, author, genre FROM books WHERE user_id = ?",
      [userId]
    );

    if (!Array.isArray(userBooks)) {
      console.error("UserBooks is not an array:", userBooks);
      await connection.end();
      return res.status(500).json({
        success: false,
        message: "데이터 형식 오류가 발생했습니다.",
      });
    }

    console.log("사용자의 책 목록:", userBooks);

    // 중복 제거 및 정리
    const authors = [...new Set(userBooks.map(book => cleanAuthorName(book.author)))];
    const titles = [...new Set(userBooks.map(book => book.title))];
    const genres = [...new Set(userBooks.map(book => book.genre))];
    const excludedTitles = userBooks.map(book => book.title);

    console.log("검색할 작가 목록:", authors);
    console.log("검색할 제목 목록:", titles);
    console.log("검색할 장르 목록:", genres);
    console.log("제외할 책 제목 목록:", excludedTitles);

    const recommendedBooks = await searchRecommendedBooks(
      authors,
      titles,
      genres,
      excludedTitles
    );

    await connection.end();

    res.json({
      success: true,
      message: userBooks.length > 0
        ? "개인화된 추천을 제공합니다."
        : "추천할 도서를 찾을 수 없습니다.",
      recommendations: recommendedBooks,
    });
  } catch (error) {
    console.error("추천 도서 검색 오류:", error);
    res.status(500).json({
      success: false,
      message: "추천 도서를 검색 중 오류가 발생했습니다.",
    });
  }
});
