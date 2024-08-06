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

export async function addContainer(name: string, locationId: string, userId: string) {
    if(!name || name.length < 1)
        return {
            success: false,
            message: "container name cannot be empty"
        }

    if(!locationId || locationId.length < 1 || !userId || userId.length < 1)
        return {
            success: false,
            message: "location id and/or user id cannot be empty"
        }

    const supabase = createClient()

    const {error} = await supabase.from('containers').insert([
        {
            name: name,
            location_id: locationId,
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
        message: `Container added: ${name}`
    }
}

export async function getContainersForLocation(locationId: string, userId: string) {
    if(!userId || userId.length < 1)
        return {
            success: false,
            message: "user id cannot be empty"
        }
    if(!locationId || locationId.length < 1)
        return {
            success: false,
            message: "location id cannot be empty"
        }

    const supabase = createClient()

    const {data, error} = await supabase.from('containers').select('*').eq('location_id', locationId).eq('user_id', userId)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Containers retrieved",
        data: data
    }
}

export async function getAllContainers(userId: string) {
    if(!userId || userId.length < 1)
        return {
            success: false,
            message: "user id cannot be empty"
        }

    const supabase = createClient()

    const {data, error} = await supabase.from('containers').select('*').eq('user_id', userId)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Containers retrieved",
        data: data
    }
}

