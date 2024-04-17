import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {filters, filtersKeys} from "@/types/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function qSeparateColon(q: string):[string, filters] {
  const filters: filters = {}
  const qArray = q.split(" ")
  const toAdd: string[] = []
  qArray.filter(word => word.includes(":")).forEach(word => {
    const [key, value]: [filtersKeys, string] = word.split(":") as [filtersKeys, string]
    switch (key) {
      case "category":
        filters.category = value.split(",")
        break
      case "price":
        filters.price = value.split(",").map(Number) as [number, number]
        break
      case "publishedDate":
        filters.publishedDate = value.split(",").map(date => new Date(date)) as [Date, Date]
        break
      case "authors":
        filters.authors = value.split(",")
        break
      case "authorsExact":
        filters.authorsExact = value == "true"
        break
      case "title":
        filters.title = value
        break
      default:
        toAdd.push(word)
    }
  })
  return [q.split(" ").filter(word => !word.includes(":") || toAdd.includes(word)).join(" "), filters]

}