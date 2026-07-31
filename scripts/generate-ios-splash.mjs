import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'splash');
const iconPath = path.join(root, 'public', 'icons', 'icon-512x512.png');
const background = { r: 26, g: 25, b: 27, alpha: 1 };

const devices = [
  { width: 320, height: 568, ratio: 2 },
  { width: 375, height: 667, ratio: 2 },
  { width: 414, height: 736, ratio: 3 },
  { width: 375, height: 812, ratio: 3 },
  { width: 414, height: 896, ratio: 2 },
  { width: 414, height: 896, ratio: 3 },
  { width: 360, height: 780, ratio: 3 },
  { width: 390, height: 844, ratio: 3 },
  { width: 428, height: 926, ratio: 3 },
  { width: 393, height: 852, ratio: 3 },
  { width: 430, height: 932, ratio: 3 },
  { width: 402, height: 874, ratio: 3 },
  { width: 420, height: 912, ratio: 3 },
  { width: 440, height: 956, ratio: 3 },
  { width: 744, height: 1133, ratio: 2 },
  { width: 768, height: 1024, ratio: 2 },
  { width: 820, height: 1180, ratio: 2 },
  { width: 834, height: 1112, ratio: 2 },
  { width: 834, height: 1194, ratio: 2 },
  { width: 1024, height: 1366, ratio: 2 },
];

fs.mkdirSync(outDir, { recursive: true });

const icon = sharp(iconPath);
const links = [];

async function createSplash(pixelWidth, pixelHeight) {
  const iconSize = Math.round(Math.min(pixelWidth, pixelHeight) * 0.32);
  const resizedIcon = await icon
    .clone()
    .resize(iconSize, iconSize, { fit: 'contain', background })
    .png()
    .toBuffer();

  const left = Math.round((pixelWidth - iconSize) / 2);
  const top = Math.round((pixelHeight - iconSize) / 2);
  const fileName = `apple-splash-${pixelWidth}-${pixelHeight}.png`;
  const filePath = path.join(outDir, fileName);

  await sharp({
    create: {
      width: pixelWidth,
      height: pixelHeight,
      channels: 4,
      background,
    },
  })
    .composite([{ input: resizedIcon, left, top }])
    .png()
    .toFile(filePath);

  return `/splash/${fileName}`;
}

for (const device of devices) {
  const portraitWidth = device.width * device.ratio;
  const portraitHeight = device.height * device.ratio;
  const landscapeWidth = device.height * device.ratio;
  const landscapeHeight = device.width * device.ratio;

  const portraitHref = await createSplash(portraitWidth, portraitHeight);
  const landscapeHref = await createSplash(landscapeWidth, landscapeHeight);

  const mediaBase = `(device-width: ${device.width}px) and (device-height: ${device.height}px) and (-webkit-device-pixel-ratio: ${device.ratio})`;

  links.push(
    `    <link rel="apple-touch-startup-image" href="${portraitHref}" media="${mediaBase} and (orientation: portrait)" />`,
  );
  links.push(
    `    <link rel="apple-touch-startup-image" href="${landscapeHref}" media="${mediaBase} and (orientation: landscape)" />`,
  );
}

const uniqueLinks = [...new Set(links)];
console.log(uniqueLinks.join('\n'));
console.log(`\nGenerated ${uniqueLinks.length} startup image tags in ${outDir}`);
