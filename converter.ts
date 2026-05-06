import fs from "fs";

function formatSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-");
}

const flowers = `
Marilyn Pink Carnation Mother's Day Bouquet
Mischa Pink Carnation Mother's Day Bouquet
Marilyn Carnation Mother's Day Russian Bouquet
Tessa Pink Lily Mother's Day Bouquet
Zandra Pink Gerbera Mother's Day Flower Box
Ayame Pink Gerbera Mother's Day Flower Box
Zaylee Pink Mum Mother's Day Flower Box
Phoebe Pink Carnation Mother's Day Flower Box
Trixie Pink Lily Mother's Day Bouquet
Kathy Red Rose Mother's Day Bouquet
Zooey Yellow Sunflower Mother's Day Bouquet
Laycie Lilac Rose Mother's Day Bouquet
Beatrice Rose Lily Mother's Day Bouquet
Miriam Pink Carnation Mother's Day Russian Bouquet
Lyndi Red Rose Mother's Day Heart Bouquet
Tessa Pink Lily Mother's Day Flower Box
Zooey Yellow Sunflower Mother's Day Flower Box
Beatrice Rose Lily Mother's Day Flower Box
Izzy Pink Daisy Mother's Day Flower Box
Zendaya Yellow Sunflower Mother's Day Flower Box
Zinnia White Gerbera Mother's Day Flower Box
Luxe Beatrice Rose Lily Mother's Day Flower Box
Luxe Kate Red Rose Mother's Day Flower Box
Mother's Day Pink Phalaenopsis Orchid (1 stalk)
Mother's Day Pink Phalaenopsis Orchid (2 stalks)
Indira Pink & White Mother's Day Phalaenopsis Orchid
`;

const flowerList = flowers
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

const slugList = flowerList.map(formatSlug);

fs.writeFileSync("flower-slugs.txt", slugList.join("\n"), "utf-8");
