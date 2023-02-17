import * as dotenv from "dotenv";
import fs from "fs-extra";
import * as mysql from "mysql";
import { modeArray, slugify } from "./utils.js";

dotenv.config();

function findDomainOfUniversity(university) {
  const candidates = [];

  for (const faculty of university["faculties"]) {
    for (const teacher of faculty["teachers"]) {
      if (teacher["email"] != null) {
        const tld = teacher["email"].split("@")[1];
        if (tld.endsWith(".edu.tr")) {
          candidates.push(tld);
        }

        if (candidates.length > 10) {
          return modeArray(candidates);
        }
      }
    }
  }

  return null;
}

function createUniversity(connection, data, domain) {
  return new Promise((resolve, reject) => {
    // Create University
    const createUniversityQuery =
      "INSERT INTO `University` (name, slug, updatedAt) VALUES (?, ?, ?)";
    const createUniversityValues = [
      data["name"],
      slugify(data["name"]),
      new Date(),
    ];

    connection.query(
      {
        sql: createUniversityQuery,
        values: createUniversityValues,
      },
      (universityError, result) => {
        if (universityError) {
          reject(universityError);
        }

        const createDomainQuery =
          "INSERT INTO `Domain` (name, updatedAt, universityId) VALUES (?, ?, ?)";
        const createDomainValues = [domain, new Date(), result.insertId];

        connection.query(
          {
            sql: createDomainQuery,
            values: createDomainValues,
          },
          (domainError) => {
            if (domainError) {
              reject(domainError);
            }

            resolve(result.insertId);
          }
        );
      }
    );
  });
}

function isFacultyExists(connection, data) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM `Faculty` WHERE name = ?";
    const values = [data["name"]];
    connection.query(
      {
        sql: query,
        values: values,
      },
      (error, result) => {
        if (error) {
          reject(error);
        }

        if (result.length > 0) {
          resolve(result[0].id);
        } else {
          resolve(null);
        }
      }
    );
  });
}

function createFaculty(connection, data, universityId) {
  return new Promise(async (resolve, reject) => {
    const exists = await isFacultyExists(connection, data);
    if (exists !== null) {
      const relationQuery =
        "INSERT INTO `_FacultyToUniversity` (A, B) VALUES (?, ?)";
      const relationValues = [exists, universityId];

      connection.query(
        {
          sql: relationQuery,
          values: relationValues,
        },
        (relationError) => {
          if (relationError) {
            reject(relationError);
          }

          resolve(exists);
        }
      );
    } else {
      const createFacultyQuery =
        "INSERT INTO `Faculty` (name, slug, updatedAt) VALUES (?, ?, ?)";
      const createFacultyValues = [
        data["name"],
        slugify(data["name"]),
        new Date(),
      ];

      connection.query(
        {
          sql: createFacultyQuery,
          values: createFacultyValues,
        },
        (facultyError, result) => {
          if (facultyError) {
            reject(facultyError);
          }

          const relationQuery =
            "INSERT INTO `_FacultyToUniversity` (A, B) VALUES (?, ?)";
          const relationValues = [result.insertId, universityId];

          connection.query(
            {
              sql: relationQuery,
              values: relationValues,
            },
            (relationError) => {
              if (relationError) {
                reject(relationError);
              }

              resolve(result.insertId);
            }
          );
        }
      );
    }
  });
}

function createMultipleTeachers(connection, data, facultyId, universityId) {
  return new Promise((resolve, reject) => {
    const createTeacherQuery =
      "INSERT IGNORE INTO `Teacher` (name, slug, updatedAt, universityId, facultyId) VALUES ?";

    // MYSQL Automatically turns [['a', 'b'], ['c', 'd']] into ('a', 'b'), ('c', 'd').
    // So we need to map the data to [['a', 'b'], ['c', 'd']] format.
    const createTeacherValues = data.map((teacher) => [
      teacher["name"],
      slugify(teacher["name"]),
      new Date(),
      universityId,
      facultyId,
    ]);

    connection.query(
      createTeacherQuery,
      [createTeacherValues],
      (teacherError) => {
        if (teacherError) {
          reject(teacherError);
        }

        resolve();
      }
    );
  });
}

async function main() {
  const data = await fs.readJSON("./output.json");

  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.connect();

  for (const u of data) {
    if (u["faculties"].length === 0) {
      continue;
    }

    const domain = findDomainOfUniversity(u);
    if (domain == null) {
      continue;
    }

    log(u["name"]);
    const universityId = await createUniversity(connection, u, domain);

    for (const f of u["faculties"]) {
      if (f["teachers"].length === 0) {
        continue;
      }

      log(`${u["name"]} - ${f["name"]}`);
      const facultyId = await createFaculty(connection, f, universityId);
      await createMultipleTeachers(
        connection,
        f["teachers"],
        facultyId,
        universityId
      );
    }
  }

  connection.end();
  log(`Done!`);

  // I don't know why but it doesn't exit without this line.
  process.exit(0);
}

main();
