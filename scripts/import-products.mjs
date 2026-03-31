import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
let inputArg = "produse noi/products.json";
let defaultStock = 0;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--default-stock") {
    defaultStock = parseInt(args[index + 1] || "0", 10) || 0;
    index += 1;
    continue;
  }

  if (arg.startsWith("--default-stock=")) {
    defaultStock = parseInt(arg.split("=")[1] || "0", 10) || 0;
    continue;
  }

  if (!arg.startsWith("--")) {
    inputArg = arg;
  }
}

const inputPath = path.resolve(process.cwd(), inputArg);
const dryRun = !args.includes("--commit");
const publish = args.includes("--publish");
const apparelSizes = new Set(["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "ONE SIZE", "ONE-SIZE", "UNI"]);
const productNameOverrides = JSON.parse(
  await fs.readFile(
    path.resolve(process.cwd(), "lib/product-name-overrides.json"),
    "utf8"
  )
);
const productDescriptionOverrides = JSON.parse(
  await fs.readFile(
    path.resolve(process.cwd(), "lib/product-description-overrides.json"),
    "utf8"
  )
);

const parseEnv = (raw) =>
  raw.split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return env;
    const [key, ...valueParts] = trimmed.split("=");
    env[key.trim()] = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
    return env;
  }, {});

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const parsePrice = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value * 100);
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "");
  const parsed = Number.parseFloat(normalized.replace(",", "."));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
};

const normalizeSize = (label) => {
  if (typeof label !== "string") return null;
  const upper = label.trim().toUpperCase();
  if (!upper) return null;
  if (apparelSizes.has(upper)) return upper === "ONE SIZE" || upper === "ONE-SIZE" ? "Uni" : upper;
  if (/^\d{2}$/.test(upper)) {
    const numeric = parseInt(upper, 10);
    return numeric >= 32 && numeric <= 56 ? upper : null;
  }
  return null;
};

const inferCategory = (name = "", categoryId = "") => {
  const value = String(name).toLocaleLowerCase("ro-RO");
  if (categoryId === "2153" || ((value.includes("geant") || value.includes("poșet")) && (value.includes("bijuter") || value.includes("colier") || value.includes("cercei")))) return ["GENȚI & POȘETE", "Seturi cu geantă + bijuterii"];
  if (categoryId === "3031" || (value.includes("ceas") && (value.includes("set") || value.includes("cadou")))) return ["BIJUTERII & CEASURI", "Seturi cadou cu ceas"];
  if (categoryId === "9278" || value.includes("ceas")) return ["BIJUTERII & CEASURI", "Ceas"];
  if (categoryId === "1756" || value.includes("bijuter") || value.includes("colier") || value.includes("cercei") || value.includes("inel")) return ["BIJUTERII & CEASURI", "Seturi de bijuterii"];
  if (value.includes("slip") || value.includes("lenjer")) return ["LENJERIE & HOMEWEAR", "Slipuri / Lenjerie intimă"];
  if (categoryId === "1751" || value.includes("sandal")) return ["ÎNCĂLȚĂMINTE", "Sandale"];
  if (categoryId === "3289" || categoryId === "1860" || value.includes("salop")) return ["ÎMBRĂCĂMINTE", "Salopete"];
  if (categoryId === "2977" || value.includes("costum")) return ["ÎMBRĂCĂMINTE", "Costum"];
  if (categoryId === "1780" || value.startsWith("set ") || value.includes(" set ")) return ["ÎMBRĂCĂMINTE", "Seturi / Compleuri"];
  if (categoryId === "12476" || categoryId === "12475" || categoryId === "1727" || value.includes("roch")) return ["ÎMBRĂCĂMINTE", "Rochii"];
  if (value.includes("geant") || value.includes("poșet") || value.includes("poset")) return ["GENȚI & POȘETE", "Poșetă de seară"];
  return ["ACCESORII", "Accesorii de ocazie"];
};

const inferColor = (name = "") => {
  const value = String(name).toLocaleLowerCase("ro-RO");
  if (value.includes("negru") || value.includes("neagr")) return "Negru";
  if (value.includes("alb")) return "Alb";
  if (value.includes("maro")) return "Maro";
  if (value.includes("bleumarin")) return "Bleumarin";
  if (value.includes("verde")) return "Verde";
  if (value.includes("roz")) return "Roz";
  if (value.includes("fucsia")) return "Fucsia";
  if (value.includes("auriu")) return "Auriu";
  if (value.includes("argintiu")) return "Argintiu";
  return null;
};

const inferSeason = (name = "") => {
  const value = String(name).toLocaleLowerCase("ro-RO");
  if (value.includes("toamn") && value.includes("iarn")) return "Toamnă / Iarnă";
  if (value.includes("primăvar") && value.includes("var")) return "Primăvară / Vară";
  if (value.includes("toamn")) return "Toamnă";
  if (value.includes("iarn")) return "Iarnă";
  if (value.includes("primăvar")) return "Primăvară";
  if (value.includes("vară") || value.includes("vara")) return "Vară";
  return null;
};

const filterImages = (images = []) =>
  [...new Set(images.filter((url) => typeof url === "string" && url.startsWith("http")).filter((url) => !url.toLowerCase().endsWith(".png") && !url.includes("/v4/p/ccc/")))];

const loadEnv = async () => {
  const files = await Promise.allSettled([fs.readFile(".env.local", "utf8"), fs.readFile(".env", "utf8")]);
  return files.reduce((env, result) => result.status === "fulfilled" ? { ...env, ...parseEnv(result.value) } : env, {});
};

const env = await loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const rawProducts = JSON.parse(await fs.readFile(inputPath, "utf8"));
const usedSlugs = new Set();

const prepared = rawProducts
  .filter((item) => item && String(item.status || "").toLowerCase() === "ok")
  .map((item) => {
    const sourceName = String(item.name || "").trim();
    const sourceId = String(item?.shein?.shareId || item?.shein?.categoryId || "produs");
    const slugBase = slugify(sourceName) || `produs-${sourceId}`;
    const name = productNameOverrides[slugBase] || sourceName;
    const [categoryGroup, category] = inferCategory(sourceName, String(item?.shein?.categoryId || ""));
    const priceCents = parsePrice(item?.price?.current?.value) || parsePrice(item?.price?.current?.text) || parsePrice(item?.price?.original?.value) || parsePrice(item?.price?.original?.text) || 0;
    const compareAt = parsePrice(item?.price?.original?.value) || parsePrice(item?.price?.original?.text);
    const sizes = Array.from(new Set((item.sizes || []).map((size) => normalizeSize(size?.label)).filter(Boolean)));
    let slug = slugBase;
    let suffix = 2;
    while (usedSlugs.has(slug)) slug = `${slugBase}-${suffix++}`;
    usedSlugs.add(slug);
    return {
      product: {
        name,
        slug,
        description:
          productDescriptionOverrides[slugBase] ||
          (typeof item.description === "string" &&
          !item.description.startsWith("De la încălțăminte")
            ? item.description.trim()
            : null),
        category_group: categoryGroup,
        category,
        material: null,
        season: inferSeason(name),
        is_archived: !publish,
      },
      variants: (sizes.length > 0 ? sizes : ["Uni"]).map((size) => ({
        size,
        color: inferColor(name),
        price_cents: priceCents,
        compare_at_price_cents: compareAt && compareAt > priceCents ? compareAt : null,
        stock: defaultStock,
        sku: `${slug}-${String(size).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      })),
      images: filterImages(item.images).map((url, index) => ({
        url,
        alt_text: index === 0 ? name : `${name} - imagine ${index + 1}`,
        sort_order: index,
      })),
    };
  })
  .filter((item) => item.product.name && item.variants.length > 0);

console.log(`Produse sursă: ${rawProducts.length}`);
console.log(`Produse pregătite: ${prepared.length}`);
console.table(prepared.reduce((summary, item) => {
  const key = `${item.product.category_group} / ${item.product.category}`;
  summary[key] = (summary[key] || 0) + 1;
  return summary;
}, {}));

if (dryRun) {
  console.log("Dry run finalizat. Rulează cu --commit pentru import real.");
  process.exit(0);
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

for (const entry of prepared) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .upsert(entry.product, { onConflict: "slug" })
    .select("id")
    .single();

  if (productError || !product) throw new Error(`Produs invalid: ${entry.product.name} - ${productError?.message || "fără id"}`);

  const variantsDelete = await supabase.from("product_variants").delete().eq("product_id", product.id);
  if (variantsDelete.error) throw new Error(variantsDelete.error.message);
  const imagesDelete = await supabase.from("product_images").delete().eq("product_id", product.id);
  if (imagesDelete.error) throw new Error(imagesDelete.error.message);
  const variantsInsert = await supabase.from("product_variants").insert(entry.variants.map((variant) => ({ ...variant, product_id: product.id })));
  if (variantsInsert.error) throw new Error(variantsInsert.error.message);
  if (entry.images.length > 0) {
    const imagesInsert = await supabase.from("product_images").insert(entry.images.map((image) => ({ ...image, product_id: product.id })));
    if (imagesInsert.error) throw new Error(imagesInsert.error.message);
  }

  console.log(`Importat: ${entry.product.name}`);
}

console.log(publish ? "Import finalizat. Produsele sunt active." : "Import finalizat. Produsele sunt arhivate pentru review.");
