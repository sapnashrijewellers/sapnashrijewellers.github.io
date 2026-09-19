import { Category, Collection } from "@/types/catalog";
import categories from '@/data/categories.json';
import collections from '@/data/collections.json';

export function getCollections(groupName: string, categoryName: string): Collection[] {
  return (collections as Collection[])
    .filter(
      (collection) =>
        collection.active !== false && collection.group === groupName && collection.category === categoryName,
    )
    .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
}

export function getCategoriesForGroup(groupName: string): Category[] {
  const groupCollections = (collections as Collection[]).filter(
    (collection) => collection.active !== false && collection.group === groupName,
  );

  const categoryNames = new Set(groupCollections.map((collection) => collection.category));

  return (categories as Category[])
    .filter((category) => category.active !== false && categoryNames.has(category.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}