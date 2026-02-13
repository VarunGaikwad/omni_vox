import fs from "fs";
import path from "path";

const projectName = path.basename(process.cwd());
const packageJsonPath = path.join(process.cwd(), "package.json");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

packageJson.name = projectName;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log("✔ package.json name updated");
