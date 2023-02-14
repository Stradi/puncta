import chalk from "chalk";
import fs from "fs-extra";
import _slugify from "slugify";

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

export function modeArray(array) {
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

export function slugify(text, addRandom = false) {
  return `${_slugify(text, {
    lower: true,
  })}${addRandom ? `-${makeid(10)}` : ""}`;
}

function makeid(length) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
