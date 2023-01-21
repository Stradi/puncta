import axios from "axios";
import chalk from "chalk";
import cheerio from "cheerio";
import promiseLimit from "promise-limit";
import { log, promiseProgress, toTitleCase, writeToFile } from "./utils.js";

const axiosClient = axios.create({});

const BASE_URL = "https://yokatlas.yok.gov.tr";
const HOME_PATH = "lisans-anasayfa.php";
const UNIVERSITY_PATH = "lisans-univ.php?u=";

// We are limiting concurrent requests to 10 because server
// blocks us if we send too many requests at once.
const limit = promiseLimit(10);

const facultyArray = [];

function getAllUniversities() {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`${BASE_URL}/${HOME_PATH}`)
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

function getFacultiesOfUniversity(university) {
  return new Promise((resolve, reject) => {
    axiosClient
      .get(`${BASE_URL}/${UNIVERSITY_PATH}${university.id}`)
      .then((response) => {
        const $ = cheerio.load(response.data);

        const faculties = $(".panel-title div")
          .map((i, el) => $(el).text().trim())
          .get()
          .map((faculty) => {
            if (!facultyArray.includes(faculty)) {
              facultyArray.push(faculty);
              return facultyArray.length - 1;
            }
            return facultyArray.indexOf(faculty);
          });

        resolve({
          name: university.name,
          faculties,
        });
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

  log("Starting to get all universities...");
  const universities = await getAllUniversities();
  log(`Found ${universities.length} universities.`);

  log("Starting to get all faculties of all universities.");

  const facultyPromises = universities.map((university) =>
    limit(() => getFacultiesOfUniversity(university))
  );

  const finalList = await promiseProgress(
    facultyPromises,
    (completed, total) => {
      log(
        `%${((completed * 100) / total).toFixed(2)} - [${completed}/${total}]`
      );
    }
  );

  log("Got all faculties of all universities.");
  log("Writing to file...");
  await writeToFile(facultyArray, "faculties.json");
  await writeToFile(finalList, "universities.json");
  log("Done.");
}

main();
