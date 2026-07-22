import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const swPath = path.join(process.cwd(), "public", "sw.js");

try {
  const content = fs.readFileSync(swPath, "utf8");

  const versionMatch = content.match(/const APP_VERSION = (\d+);/);

  if (!versionMatch) {
    console.error("Could not find APP_VERSION in sw.js");
    process.exit(1);
  }

  const currentVersion = parseInt(versionMatch[1], 10);
  const newVersion = currentVersion + 1;

  const updatedContent = content.replace(
    /const APP_VERSION = \d+;/,
    `const APP_VERSION = ${newVersion};`,
  );

  fs.writeFileSync(swPath, updatedContent, "utf8");

  console.log(`Version updated from ${currentVersion} to ${newVersion}`);
  console.log("Committing version update...");

  execSync(`git add ${swPath}`);
  execSync(
    `git commit -m"chore: bump service worker version to ${newVersion}"`,
  );

  console.log("Ready for push!");
} catch (error) {
  console.error("Error updating version:", error.message);
  process.exit(1);
}
