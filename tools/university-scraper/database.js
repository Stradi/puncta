import * as dotenv from "dotenv";
import fs from "fs-extra";
import * as mysql from "mysql";
import { log, modeArray, slugify } from "./utils.js";

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
  return new Promise((resolve) => {
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
          log(`Error while creating university ${data["name"]}`);
          log(universityError);
          resolve(null);
          return;
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
              log(`Error while creating domain ${domain}`);
              log(domainError);
              resolve(null);
              return;
            }

            resolve(result.insertId);
          }
        );
      }
    );
  });
}

function isFacultyExists(connection, data) {
  return new Promise((resolve) => {
    const query = "SELECT * FROM `Faculty` WHERE name = ?";
    const values = [data["name"]];
    connection.query(
      {
        sql: query,
        values: values,
      },
      (error, result) => {
        if (error) {
          log(`Error while checking faculty ${data["name"]}`);
          log(error);
          resolve(null);
          return;
        }

        if (result.length > 0) {
          resolve(result[0].id);
        } else {
          resolve(null);
          return;
        }
      }
    );
  });
}

function createFaculty(connection, data, universityId) {
  return new Promise(async (resolve) => {
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
            log(`Error while connecting faculty ${data["name"]}`);
            log(relationError);
            resolve(null);
            return;
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
            log(`Error while creating faculty ${data["name"]}`);
            log(facultyError);
            resolve(null);
            return;
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
                log(`Error while connecting faculty ${data["name"]}`);
                log(relationError);
                resolve(null);
                return;
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
  return new Promise((resolve) => {
    const createTeacherQuery =
      "INSERT IGNORE INTO `Teacher` (name, slug, updatedAt, universityId, facultyId) VALUES ?";

    // MYSQL Automatically turns [['a', 'b'], ['c', 'd']] into ('a', 'b'), ('c', 'd').
    // So we need to map the data to [['a', 'b'], ['c', 'd']] format.
    const createTeacherValues = data.map((teacher) => [
      teacher["name"],
      slugify(teacher["name"], true),
      new Date(),
      universityId,
      facultyId,
    ]);

    connection.query(
      createTeacherQuery,
      [createTeacherValues],
      (teacherError) => {
        if (teacherError) {
          log(`Error while creating teachers`);
          log(teacherError);
          resolve(null);
          return;
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
    if (universityId == null) {
      continue;
    }

    for (const f of u["faculties"]) {
      if (f["teachers"].length === 0) {
        continue;
      }

      log(`${u["name"]} - ${f["name"]}`);
      const facultyId = await createFaculty(connection, f, universityId);
      if (facultyId == null) {
        continue;
      }

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
