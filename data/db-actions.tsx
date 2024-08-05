'use server'

import { createClient } from '@/lib/supabaseServer'

export async function addLocation(name: string, userId: string) {
    if(!name || name.length < 1 || !userId || userId.length < 1)
        return {
            success: false,
            message: "location name cannot be empty"
        }

    const supabase = createClient()

    const {error} = await supabase.from('locations').insert([
        {
            name: name,
            user_id: userId
        }
    ])

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: `Location added: ${name}`
    }
}

export async function getLocations(userId: string) {
    if(!userId || userId.length < 1)
        return {
            success: false,
            message: "user id cannot be empty"
        }

    const supabase = createClient()

    const {data, error} = await supabase.from('locations').select('*').eq('user_id', userId)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Locations retrieved",
        data: data
    }
}

