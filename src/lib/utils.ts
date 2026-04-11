import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ndviColor(ndvi: number): string {
  if (ndvi > 0.7) return "#15803d"
  if (ndvi > 0.5) return "#65a30d"
  if (ndvi > 0.3) return "#ca8a04"
  if (ndvi > 0.1) return "#dc2626"
  return "#7f1d1d"
}

export function healthColor(status: string): string {
  switch (status) {
    case "EXCELENTE": return "#15803d"
    case "BOM": return "#65a30d"
    case "REGULAR": return "#ca8a04"
    case "CRITICO": return "#dc2626"
    case "MUITO_RUIM": return "#7f1d1d"
    default: return "#9ca3af"
  }
}

export function healthBg(status: string): string {
  switch (status) {
    case "EXCELENTE": return "#f0fdf4"
    case "BOM": return "#f7fee7"
    case "REGULAR": return "#fefce8"
    case "CRITICO": return "#fef2f2"
    case "MUITO_RUIM": return "#fef2f2"
    default: return "#f9fafb"
  }
}

export function cultureLabel(culture?: string): string {
  const map: Record<string, string> = {
    SOJA: "Soja", MILHO: "Milho", CAFE: "Café", CANA: "Cana-de-açúcar",
    ALGODAO: "Algodão", ARROZ: "Arroz", FEIJAO: "Feijão", TRIGO: "Trigo",
    MANDIOCA: "Mandioca", EUCALIPTO: "Eucalipto", PASTAGEM: "Pastagem",
    HORTIFRUTI: "Hortifrutigranjeiros", FRUTAS: "Fruticultura",
    OUTRO: "Outro", VAZIO: "Sem cultura",
  }
  return culture ? (map[culture] ?? culture) : "—"
}

export function cultureEmoji(culture?: string): string {
  const map: Record<string, string> = {
    SOJA: "🌱", MILHO: "🌽", CAFE: "☕", CANA: "🎋",
    ALGODAO: "🌸", ARROZ: "🌾", FEIJAO: "🫘", TRIGO: "🌾",
    MANDIOCA: "🥔", EUCALIPTO: "🌳", PASTAGEM: "🐄",
    HORTIFRUTI: "🥬", FRUTAS: "🍎", OUTRO: "🌿", VAZIO: "🏜️",
  }
  return culture ? (map[culture] ?? "🌾") : "🌾"
}

export function biomeLabel(biome?: string): string {
  const map: Record<string, string> = {
    CERRADO: "Cerrado", AMAZONIA: "Amazônia", MATA_ATLANTICA: "Mata Atlântica",
    CAATINGA: "Caatinga", PAMPA: "Pampa", PANTANAL: "Pantanal",
  }
  return biome ? (map[biome] ?? biome) : "—"
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function severityColor(severity: string): string {
  switch (severity) {
    case "CRITICO": return "#dc2626"
    case "ALTO": return "#d97706"
    case "MEDIO": return "#2563eb"
    case "BAIXO": return "#16a34a"
    default: return "#9ca3af"
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case "URGENTE": return "#dc2626"
    case "ALTA": return "#d97706"
    case "MEDIA": return "#2563eb"
    default: return "#9ca3af"
  }
}
