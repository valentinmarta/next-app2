import { MOCK_ADMIN } from "@/lib/mock-data"
import { localStorageService } from "@/lib/local-storage"

export const mockAuthService = {
  signIn: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    // Simple mock authentication
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const user = {
        id: "1",
        email: MOCK_ADMIN.email,
        name: MOCK_ADMIN.name,
        role: MOCK_ADMIN.role,
      }

      localStorageService.setAuth(user)
      return { success: true, user }
    }

    return { success: false, error: "Credenciales inválidas" }
  },

  signOut: (): void => {
    localStorageService.clearAuth()
  },

  getSession: (): any => {
    return localStorageService.getAuth()
  },
}
