import {create} from "zustand";


interface User {
    id:	string
    aud:	string
    role:	string
    email:	string
    email_confirmed_at:	string
    phone:	string
    phone_confirmed_at:	string
    confirmed_at:	string
    last_sign_in_at:	string
    app_metadata:	object
    user_metadata:	object
    created_at:	string
    updated_at:	string
    is_anonymous:	boolean
}


interface UserStore {
    user: User | null
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