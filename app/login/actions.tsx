'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabaseServer'

export type LoginResponse = {
    success: boolean,
    message?: string,
    data?: any
}

export async function login(email: string, password: string) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const userData = {
        email: email as string,
        password: password as string,
    }

    const { data ,error } = await supabase.auth.signInWithPassword(userData)

    if (error) {
        return {
            status: false,
            message: error.message,
        }
    }

    
    revalidatePath('/', 'layout')
    return {
        success: true,
        message: 'Login successful',
        data: data
    }
}

export async function signup(email: string, password: string) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const userData = {
        email: email as string,
        password: password as string,
    }

    const { error } = await supabase.auth.signUp(userData)

    if (error) {
        redirect('/error')
    }

    
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signInWithGithub() {
    const supabase = createClient()
    const origin = headers().get('origin')
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    })

    if(error) {
        console.log(error)
    }
    else {
        return redirect(data.url)
    }
}

export async function logout() {
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    if(error) {
        return {
            success: false,
            message: error.message,
        }
    }

    return {
        success: true,
        message: 'Logout successful',
        data: null
    }
}

export async function getUser() {

    const supabase = createClient()

    const {data: {user}} = await supabase.auth.getUser()

    if(!user) {
        return {
            success: false,
        }
    }

    return {
        success: true,
        data: user
    }
}

export async function revalidate()    {
    revalidatePath('/', 'layout')
}

