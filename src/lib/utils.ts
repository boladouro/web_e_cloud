import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { filters, filtersKeys } from "@/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function qSeparateColon(q: string): [string, filters] {
  const filters: filters = {}
  const qArray = q.split(" ")
  const toAdd: string[] = []
  qArray.filter(word => word.includes(":")).forEach(word => {
    const [key, value]: [filtersKeys, string] = word.split(":") as [filtersKeys, string]
    switch (key) {
      case "category":
        filters.category = new Set(value.split(","))
        break
      case "price":
        filters.price = [0, 0]
        filters.price[0] = Number(value)
        break
      case "publishedDate":
        filters.publishedDate = [new Date(), new Date()]
        filters.publishedDate[0] = new Date(value)
        break
      case "author":
        filters.author = value
        break
      case "title":
        filters.title = value
        break
      case "sort":
        filters.sort = value as filters["sort"]
        break
      default:
        toAdd.push(word)
    }
  })
  return [q.split(" ").filter(word => !word.includes(":") || toAdd.includes(word)).join(" "), filters]
}

export function addToFilter(currentQ: string, filterToAdd: filtersKeys, value: string): string {
  const [q, filters] = qSeparateColon(currentQ)
  switch (filterToAdd) {
    case "category":
      if (!filters.category) {
        filters.category = new Set()
      }
      filters.category.add(value)
      break
    case "price":
      if (!filters.price) {
        filters.price = [0, 0]
      }
      filters.price[0] = Number(value)
      break
    case "publishedDate":
      if (!filters.publishedDate) {
        filters.publishedDate = [new Date(), new Date()]
      }
      filters.publishedDate[0] = new Date(value)
      break
    case "author":
      filters.author = value
      break
    case "title":
      filters.title = value
      break
    case "sort":
      filters.sort = value as filters["sort"]
      break
    default:
      throw new Error("invalid filter")
  }
  return Object.entries(filters).map(([key, value]) => {
    if (value instanceof Set) {
      return `${key}:${Array.from(value).join(",")}`
    } else {
      return `${key}:${value}`
    }
  }).join(" ") + " " + q
}
