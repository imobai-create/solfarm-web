import { api } from "./api"

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password })
    const { user, accessToken, refreshToken } = res.data
    localStorage.setItem("solfarm_token", accessToken)
    localStorage.setItem("solfarm_refresh", refreshToken)
    localStorage.setItem("solfarm_user", JSON.stringify(user))
    return user
  },
  async me() {
    const res = await api.get("/auth/me")
    return res.data.user
  },
  async logout() {
    try { await api.post("/auth/logout") } catch {}
    localStorage.removeItem("solfarm_token")
    localStorage.removeItem("solfarm_refresh")
    localStorage.removeItem("solfarm_user")
  },
  getStoredUser() {
    if (typeof window === "undefined") return null
    try { return JSON.parse(localStorage.getItem("solfarm_user") ?? "null") } catch { return null }
  },
  isAuthenticated() {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("solfarm_token")
  },
}
