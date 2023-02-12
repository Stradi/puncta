import axios from "axios";
import { log, modeArray, readJSON } from "./utils.js";

const client = axios.create({});

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2NzYxMzc5MjEsImV4cCI6MTY3Njc0MjcyMX0.kyfMa9pgvltwqC3HRLivIjGdgpdLV4ZdCHPNU9G3BYI",
  },
};

async function createUniversity(name, domain) {
  const data = {
    query: `
      mutation {
        createUniversity(name: "${name}", domain: "${domain}") {
          id
        }
      }
    `,
  };

  await client.post("http://localhost:8080/graphql", data, config);
}

async function createFaculty(name, universityName) {
  const data = {
    query: `
      mutation {
        createFaculty(name: "${name}", university: { name: "${universityName}"}) {
          id
        }
      }
    `,
  };

  await client.post("http://localhost:8080/graphql", data, config);
}

async function createTeacher(name, universityName, facultyName) {
  const data = {
    query: `
      mutation {
        createTeacher(name: "${name}", university: { name: "${universityName}"}, faculty: { name: "${facultyName}"}) {
          id
        }
      }
    `,
  };

  await client.post("http://localhost:8080/graphql", data, config);
}

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

async function main() {
  const data = await readJSON("./universities-backup.json");

  for (const u of data) {
    const domain = findDomainOfUniversity(u);
    if (domain == null) {
      continue;
    }

    await createUniversity(u["name"], domain);
    for (const faculty of u["faculties"]) {
      log(`${u["name"]}\t${faculty["name"]}`);
      await createFaculty(faculty["name"], u["name"]);

      for (const teacher of faculty["teachers"]) {
        await createTeacher(teacher["name"], u["name"], faculty["name"]);
      }
    }
  }

  log(`Done!`);
}

main();
