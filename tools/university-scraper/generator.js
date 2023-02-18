import fs from "fs-extra";
import { writeToFile } from "./utils.js";

// This scripts generates universities.json and faculties.json file
// to be used by web app's register page.

// faculties.json file contains all of the faculties that exists in
// output.json file in an array. Example:
/* - Contents of faculties.json
  [
    "Faculty A",
    "Faculty B",
    "Faculty C",
    ...
  ]
*/
// universities.json file contains all of the universities that exists in
// output.json file and their faculty ids. Example:
/* - Contents of universities.json
  [
    {
      "name": "University A",
      "faculties": [
        0,
        1,
        2
      ]
    }, {
      "name": "University B",
      "faculties": [
        3,
        4,
        5
      ]
    }, {
      ...
    }
*/
async function main() {
  const data = await fs.readJSON("./output-original.json");

  const universities = [];
  const faculties = [];

  for (const university of data) {
    const universityFaculties = [];

    for (const faculty of university.faculties) {
      const facultyIndex = faculties.indexOf(faculty.name);

      if (facultyIndex === -1) {
        faculties.push(faculty.name);
        universityFaculties.push(faculties.length - 1);
      } else {
        universityFaculties.push(facultyIndex);
      }
    }

    universities.push({
      name: university.name,
      faculties: universityFaculties,
    });
  }

  await writeToFile(faculties, "./faculties.json");
  await writeToFile(universities, "./universities.json");
}

main();
