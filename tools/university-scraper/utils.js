import chalk from "chalk";
import fs from "fs-extra";

export function toTitleCase(text) {
  return text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    )
    .join(" ");
}

export function removeParantheties(text) {
  return text.replace(/ *\([^)]*\) */g, "");
}

export async function writeToFile(obj, path = "./output.json") {
  return await fs.writeJSON(path, obj, {
    spaces: 2,
    encoding: "utf8",
  });
}

export function promiseProgress(promises, cb) {
  const total = promises.length;
  let completed = 0;
  cb?.(completed, total);

  for (const promise of promises) {
    promise.then(() => {
      completed++;
      cb?.(completed, total);
    });
  }
  return Promise.all(promises);
}

export function log(text) {
  const time = new Date().toLocaleTimeString();
  console.log(`${chalk.blueBright.bold(`[${time}]`)}\t${chalk.white(text)}`);
}

export async function readJSON(path) {
  return await JSON.parse(await fs.readFile(path));
}
