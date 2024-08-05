import {create} from "zustand";

interface UserStore {
    user: Object | null
    setUser: (user: any) => void
    isLoggedIn: boolean
}

export const userStore = create<UserStore>((set) => ({
    user: null,
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => {
        set(() => ({
            isLoggedIn: isLoggedIn
        }))
    },
    setUser: (user: any) => {
        set(() => ({
            user: user
        }))
    }
}))