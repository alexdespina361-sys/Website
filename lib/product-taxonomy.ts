import taxonomyData from "./product-taxonomy.json";

type TaxonomyGroup = {
  group: string;
  categories: string[];
};

type ProductCategoryShape = {
  category: string | null;
  category_group?: string | null;
};

export const PRODUCT_TAXONOMY = taxonomyData as TaxonomyGroup[];

export const CATEGORY_GROUPS = PRODUCT_TAXONOMY.map((entry) => entry.group);

const CATEGORY_OPTIONS_BY_GROUP = PRODUCT_TAXONOMY.reduce<
  Record<string, string[]>
>((accumulator, entry) => {
  accumulator[entry.group] = entry.categories;
  return accumulator;
}, {});

const GROUP_KEYWORDS: Array<{ group: string; keywords: string[] }> = [
  {
    group: "ÎMBRĂCĂMINTE",
    keywords: [
      "roch",
      "set",
      "compleu",
      "costum",
      "salop",
      "fust",
      "corset",
      "bustier",
      "top",
      "bluz",
      "cămaș",
      "camas",
      "sacou",
      "pantalon",
      "body",
      "kimono",
      "robe satin",
      "palton",
      "cape",
      "trenci",
      "trench",
      "tricot"
    ]
  },
  {
    group: "ÎNCĂLȚĂMINTE",
    keywords: ["sandal", "pantofi", "stiletto", "botine", "mules"]
  },
  {
    group: "LENJERIE & HOMEWEAR",
    keywords: ["slip", "lenjer", "sutien", "pijama", "halat", "loungewear", "intim"]
  },
  {
    group: "GENȚI & POȘETE",
    keywords: ["poșet", "poset", "geant", "bag", "plic", "portofel", "pochette"]
  },
  {
    group: "BIJUTERII & CEASURI",
    keywords: ["bijuter", "colier", "cercei", "brăț", "brat", "inel", "ceas", "strass", "stras", "diamant"]
  },
  {
    group: "ACCESORII",
    keywords: ["accesor", "curea", "eșarf", "esarf", "șal", "sal", "mănuș", "manus", "ochelari", "broș", "bros", "păr", "par"]
  }
];

export function getCategoryOptions(categoryGroup: string | null | undefined) {
  if (!categoryGroup) {
    return [];
  }

  return CATEGORY_OPTIONS_BY_GROUP[categoryGroup] || [];
}

export function inferCategoryGroupFromLegacy(
  category: string | null | undefined
) {
  if (!category) {
    return null;
  }

  const normalizedCategory = category.toLocaleLowerCase("ro-RO");

  for (const group of GROUP_KEYWORDS) {
    if (
      group.keywords.some((keyword) => normalizedCategory.includes(keyword))
    ) {
      return group.group;
    }
  }

  return null;
}

export function formatProductCategory(product: ProductCategoryShape) {
  const categoryGroup =
    product.category_group || inferCategoryGroupFromLegacy(product.category);

  if (categoryGroup && product.category) {
    return `${categoryGroup} / ${product.category}`;
  }

  return product.category || categoryGroup || "";
}
