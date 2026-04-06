#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const catalogPath = path.join(repoRoot, "data", "catalog.json");
const outputDir = path.join(repoRoot, "public", "products", "generated");
const outputPrefix = "/products/generated";
const localApiEndpoint = "http://localhost:8090/api/freepik/text-to-image";
const freepikEndpoint = "https://api.freepik.com/v1/ai/text-to-image";
const backgroundColor = "#F6F7F5";

function parseArgs(argv) {
  const args = {
    start: 0,
    limit: Number.POSITIVE_INFINITY,
    resume: true,
    variants: [1],
    types: ["plant", "pot", "extra"]
  };

  for (const arg of argv) {
    if (arg.startsWith("--start=")) {
      args.start = Number.parseInt(arg.slice("--start=".length), 10) || 0;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      args.limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
      continue;
    }

    if (arg.startsWith("--variants=")) {
      const parsedVariants = arg
        .slice("--variants=".length)
        .split(",")
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= 3);

      if (parsedVariants.length > 0) {
        args.variants = [...new Set(parsedVariants)].sort((left, right) => left - right);
      }

      continue;
    }

    if (arg.startsWith("--types=")) {
      const parsedTypes = arg
        .slice("--types=".length)
        .split(",")
        .map((value) => value.trim())
        .filter((value) => ["plant", "pot", "extra"].includes(value));

      if (parsedTypes.length > 0) {
        args.types = [...new Set(parsedTypes)];
      }

      continue;
    }

    if (arg === "--no-resume") {
      args.resume = false;
    }
  }

  return args;
}

function parseEnvFile(content) {
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadFreepikApiKey() {
  const envPaths = [path.join(repoRoot, ".env.local"), path.join(repoRoot, ".env")];

  for (const envPath of envPaths) {
    try {
      const content = await readFile(envPath, "utf8");
      const parsed = parseEnvFile(content);
      if (parsed.FREEPIK_API_KEY) {
        return parsed.FREEPIK_API_KEY;
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return process.env.FREEPIK_API_KEY ?? "";
}

function flattenCatalog(catalog) {
  return [
    ...catalog.plants.map((product) => ({ section: "plants", product })),
    ...catalog.pots.map((product) => ({ section: "pots", product })),
    ...catalog.extras.map((product) => ({ section: "extras", product }))
  ];
}

function describeExtraProduct(productName) {
  const normalized = productName.toLowerCase();

  if (
    normalized.includes("soil") ||
    normalized.includes("fertilizer") ||
    normalized.includes("bark") ||
    normalized.includes("soap") ||
    normalized.includes("booster") ||
    normalized.includes("spikes")
  ) {
    return `packaged ${productName} gardening supply`;
  }

  if (normalized.includes("shears")) {
    return `${productName} gardening tool`;
  }

  if (normalized.includes("meter")) {
    return `${productName} plant care tool`;
  }

  if (normalized.includes("can")) {
    return `${productName} watering accessory`;
  }

  if (normalized.includes("pole")) {
    return `${productName} plant support accessory`;
  }

  if (normalized.includes("tray")) {
    return `${productName} plant care tray`;
  }

  if (normalized.includes("vase")) {
    return `${productName} glass plant accessory`;
  }

  if (normalized.includes("cloth")) {
    return `${productName} folded plant care cloth`;
  }

  if (normalized.includes("heat pack")) {
    return `${productName} shipping accessory`;
  }

  return `${productName} plant care accessory`;
}

function getAssetName(productId, variant) {
  if (variant === 1) {
    return `${productId}-main.png`;
  }

  return `${productId}-alt-${variant}.png`;
}

function buildVariantDirection(product, variant) {
  if (product.type === "plant") {
    if (variant === 2) {
      return "slight three-quarter angle, planter and leaf spread clearly visible";
    }

    if (variant === 3) {
      return "slightly tighter crop, still full product visible, emphasize leaf texture and silhouette";
    }
  }

  if (product.type === "pot") {
    if (variant === 2) {
      return "slight three-quarter angle, show rim depth and side profile";
    }

    if (variant === 3) {
      return "slightly elevated angle, show interior opening and exterior texture";
    }
  }

  if (variant === 2) {
    return "slight three-quarter angle, clear product form and depth";
  }

  if (variant === 3) {
    return "slightly tighter composition, emphasize surface detail while keeping full product visible";
  }

  return "front-facing hero angle, centered composition";
}

function buildPrompt(product, variant) {
  const promptPrefix =
    "Photorealistic ecommerce studio product photo, premium catalog quality, centered composition, seamless solid background";
  const promptSuffix =
    "soft diffused studio lighting, realistic materials, subtle natural shadow, minimal styling, single product only, no text, no logo, no watermark, no props, no hands";
  const variantDirection = buildVariantDirection(product, variant);

  if (product.type === "plant") {
    return `${promptPrefix} ${backgroundColor}, healthy ${product.name} houseplant in a tasteful minimal planter, full plant visible, botanical detail, clean silhouette, ${variantDirection}, ${promptSuffix}`;
  }

  if (product.type === "pot") {
    return `${promptPrefix} ${backgroundColor}, empty ${product.name} planter, full object visible, ceramic texture detail, ${variantDirection}, ${promptSuffix}`;
  }

  return `${promptPrefix} ${backgroundColor}, ${describeExtraProduct(product.name)}, full object visible, clean packaging or object form, ${variantDirection}, ${promptSuffix}`;
}

function buildNegativePrompt(product) {
  const shared =
    "busy room interior, multiple objects, duplicate product, plant shelf, person, hand, typography, brand mark, watermark, illustration, vector art, cartoon, CGI, blurry image, cut off subject";

  if (product.type === "plant") {
    return `${shared}, damaged leaves, dying plant, oversized decorative room scene`;
  }

  if (product.type === "pot") {
    return `${shared}, plant inside pot, soil spilling out`;
  }

  return `${shared}, unrelated accessories, lifestyle scene`;
}

async function generateImage({ apiKey, product, variant }) {
  const requestPayload = {
    prompt: buildPrompt(product, variant),
    negative_prompt: buildNegativePrompt(product),
    guidance_scale: 1,
    num_images: 1,
    image: {
      size: "square_1_1"
    },
    filter_nsfw: true
  };
  let response;
  let usedLocalApi = false;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      response = await fetch(localApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-codex-batch": "true"
        },
        body: JSON.stringify({
          prompt: requestPayload.prompt,
          negativePrompt: buildNegativePrompt(product),
          guidanceScale: 1,
          numImages: 1,
          size: "square_1_1",
          filterNsfw: true
        })
      });
      usedLocalApi = true;
      break;
    } catch (error) {
      if (attempt === 2) {
        try {
          response = await fetch(freepikEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-freepik-api-key": apiKey
            },
            body: JSON.stringify(requestPayload)
          });
          usedLocalApi = false;
          break;
        } catch (fallbackError) {
          if (attempt === 4) {
            throw fallbackError;
          }
        }
      } else if (attempt === 4) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  if (!response.ok) {
    let details = `Freepik request failed with ${response.status}.`;

    try {
      const payload = await response.json();
      details = payload?.message ?? payload?.error ?? details;
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        details = text;
      }
    }

    throw new Error(details);
  }

  const payload = await response.json();

  if (usedLocalApi) {
    const dataUrl = payload?.images?.[0]?.dataUrl;

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.includes(",")) {
      throw new Error("Local Freepik route did not return image data.");
    }

    return {
      buffer: Buffer.from(dataUrl.split(",")[1], "base64"),
      meta: payload.meta ?? null
    };
  }

  const image = payload?.data?.[0];

  if (!image?.base64) {
    throw new Error("Freepik did not return image data.");
  }

  return {
    buffer: Buffer.from(image.base64, "base64"),
    meta: payload.meta ?? null
  };
}

function updateImages(product, generatedImagePaths) {
  const currentImages = Array.isArray(product.images) ? product.images : [];
  const generatedSet = new Set(generatedImagePaths);
  const remainingImages = currentImages.filter((currentImage) => !generatedSet.has(currentImage));
  product.images = [...generatedImagePaths, ...remainingImages];
}

async function saveCatalog(catalog) {
  const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
  const retryableCodes = new Set(["EBUSY", "EPERM", "UNKNOWN"]);

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      await writeFile(catalogPath, serialized, "utf8");
      return;
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (!retryableCodes.has(code) || attempt === 5) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = await loadFreepikApiKey();

  if (!apiKey) {
    throw new Error("FREEPIK_API_KEY was not found in .env.local, .env, or process env.");
  }

  await mkdir(outputDir, { recursive: true });

  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const allProducts = flattenCatalog(catalog).filter(({ product }) => args.types.includes(product.type));
  const selectedProducts = allProducts.slice(args.start, args.start + args.limit);
  const summary = {
    total: selectedProducts.length,
    generated: 0,
    skipped: 0,
    failed: 0
  };

  for (let index = 0; index < selectedProducts.length; index += 1) {
    const { product } = selectedProducts[index];
    const generatedAssetPaths = [1, 2, 3].map(
      (variant) => `${outputPrefix}/${getAssetName(product.id, variant)}`
    );
    const requestedVariants = args.variants.filter((variant) => {
      const assetPath = `${outputPrefix}/${getAssetName(product.id, variant)}`;
      return !(args.resume && product.images?.includes(assetPath));
    });

    if (requestedVariants.length === 0) {
      summary.skipped += 1;
      console.log(`[${index + 1}/${selectedProducts.length}] Skipped ${product.name}`);
      continue;
    }

    console.log(
      `[${index + 1}/${selectedProducts.length}] Generating ${product.name} variants ${requestedVariants.join(", ")}`
    );

    try {
      for (const variant of requestedVariants) {
        const assetName = getAssetName(product.id, variant);
        const absoluteAssetPath = path.join(outputDir, assetName);
        const { buffer } = await generateImage({ apiKey, product, variant });
        await writeFile(absoluteAssetPath, buffer);
      }

      const availableGeneratedPaths = [1, 2, 3]
        .filter((variant) => {
          const assetPath = `${outputPrefix}/${getAssetName(product.id, variant)}`;
          return product.images?.includes(assetPath) || requestedVariants.includes(variant);
        })
        .map((variant) => `${outputPrefix}/${getAssetName(product.id, variant)}`);

      updateImages(product, availableGeneratedPaths);
      await saveCatalog(catalog);
      summary.generated += 1;
    } catch (error) {
      summary.failed += 1;
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed for ${product.name}: ${message}`);
    }
  }

  console.log(
    `Completed generation. Generated: ${summary.generated}, skipped: ${summary.skipped}, failed: ${summary.failed}, selected: ${summary.total}`
  );

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(message);
  process.exitCode = 1;
});
