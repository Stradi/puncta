import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import chalk from "chalk";
import cheerio from "cheerio";
import promiseLimit from "promise-limit";
import { CookieJar } from "tough-cookie";
import {
  log,
  promiseProgress,
  removeParantheties,
  toTitleCase,
  writeToFile,
} from "./utils.js";

const jar = new CookieJar();
const axiosClient = wrapper(
  axios.create({
    jar,
  })
);

const BASE_URL = "https://yokatlas.yok.gov.tr";
const UNIVERSITY_PATH = "lisans-univ.php?u=";

// We are limiting concurrent requests to 10 because server
// blocks us if we send too many requests at once.
const limit = promiseLimit(10);

function getTeachersOfFaculty(url, client) {
  function handlePagination(data) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(data);
      const pagination = $("ul.pagination").get();
      const activePage = $("li.active", pagination);
      const nextPageHref = $("a", activePage.next()).attr("href");

      if (nextPageHref) {
        resolve(nextPageHref);
      } else {
        resolve(undefined);
      }
    });
  }

  function scrapeSinglePage(data) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(data);
      const teachers = $("tr")
        .get()
        .map((el) => {
          const infoColumns = $("td", el).get();
          const mainInfoColumn = infoColumns[2];
          mainInfoColumn.children = mainInfoColumn.children.filter(
            (c) => c.data !== " " && c.name !== undefined
          );

          if (mainInfoColumn.children[0].name === "span") {
            mainInfoColumn.children = mainInfoColumn.children.slice(1);
          }

          const title = toTitleCase(
            $(mainInfoColumn.children[0]).text().trim()
          );
          const name = toTitleCase($(mainInfoColumn.children[1]).text().trim());
          const email = $("a", infoColumns[3]).attr("href").split(":")[1];

          return {
            title,
            name,
            email,
          };
        });

      resolve(teachers);
    });
  }

  return new Promise((resolve, reject) => {
    client
      .get(`${url}`)
      .then(async (response) => {
        const teachers = await scrapeSinglePage(response.data);
        const nextPageHref = await handlePagination(response.data);

        if (nextPageHref) {
          const nextTeachers = await getTeachersOfFaculty(
            `https://akademik.yok.gov.tr${nextPageHref}`,
            client
          );
          resolve([...teachers, ...nextTeachers]);
        }

        resolve(teachers);
      })
      .catch((e) => reject(e));
  });
}

function scrapeSingleUniversity(universityId, cb) {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`${BASE_URL}/${UNIVERSITY_PATH}${universityId}`)
      .then(async (response) => {
        const university = {
          id: universityId,
        };

        const $ = cheerio.load(response.data);
        university["name"] = toTitleCase(
          $("h3")
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })[0]
            .nodeValue.trim()
        );

        university["faculties"] = $(".panel-title a")
          .map((i, el) => ({
            id: $(el).attr("href").split("=")[1],
            name: removeParantheties(toTitleCase($("div", el).text().trim())),
          }))
          .get()
          .reduce((acc, faculty) => {
            if (!acc.find((f) => f.name === faculty["name"])) {
              acc.push(faculty);
            }
            return acc;
          }, []);

        const promises = university["faculties"].map((faculty) =>
          limit(() =>
            getTeachersOfFaculty(
              `https://yokatlas.yok.gov.tr/externalAppParameter.php?y=${faculty.id}`,
              wrapper(
                axios.create({
                  jar: new CookieJar(),
                })
              )
            )
          )
        );

        const teachers = await promiseProgress(promises, (completed, total) => {
          cb?.({
            id: university["name"],
            status: "Scraping",
            completed,
            total,
          });
        });

        university["faculties"] = university["faculties"].map((faculty, i) => ({
          ...faculty,
          teachers: teachers[i],
        }));

        resolve(university);
      })
      .catch((e) => reject(e));
  });
}

function getAllUniversities() {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`https://yokatlas.yok.gov.tr/lisans-anasayfa.php`)
      .then((response) => {
        const $ = cheerio.load(response.data);

        const universities = $("select#univ > optgroup > option")
          .map((i, el) => ({
            id: $(el).attr("value"),
            name: toTitleCase($(el).text()),
          }))
          .get();

        resolve(universities);
      })
      .catch((e) => reject(e));
  });
}

async function main() {
  console.log(
    `${chalk.bgWhite.black.bold(" Puncta ")} ${chalk.bold.bgBlack.white(
      "University and Faculty Scraper"
    )}`
  );
  console.log("---------------------------------------");

  log("Getting all universities...");
  const allUniversities = await getAllUniversities();
  log(`Found ${allUniversities.length} universities.`);

  const universities = [];
  for (const u of allUniversities) {
    const data = await scrapeSingleUniversity(u.id, (progress) => {
      log(`Scraping ${progress.id} (${progress.completed}/${progress.total})`);
    });

    universities.push(data);
  }

  writeToFile("universities.json", universities);

  log("Done.");
}

main();
