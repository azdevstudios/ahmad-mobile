import CatalogSeed from "@/models/CatalogSeed";
import StoreService from "@/models/StoreService";
import { serviceDefaults } from "@/lib/catalog/defaults";

export async function ensureCatalogSeeded() {
  const key = "catalog-defaults-v1";
  if (await CatalogSeed.exists({ key })) return;

  if (!(await StoreService.exists({}))) {
    await StoreService.insertMany(serviceDefaults);
  }

  try {
    await CatalogSeed.create({ key });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
}
