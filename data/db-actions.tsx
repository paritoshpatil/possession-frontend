'use server'

import { createClient } from '@/lib/supabaseServer'
import {Item} from "@/models/item";

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

export async function getCategoriesForUser(userId: string) {
    if(!userId || userId.length < 1)
        return {
            success: false,
            message: "user id cannot be empty"
        }

    const supabase = createClient()

    const {data, error} = await supabase.from('categories').select('*').eq('user_id', userId)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Categories retrieved",
        data: data
    }
}

export async function addCategory(name: string, userId: string) {
    if(!name || name.length < 1)
        return {
            success: false,
            message: "category name cannot be empty"
        }

    if(!userId || userId.length < 1)
        return {
            success: false,
            message: "user id cannot be empty"
        }

    const supabase = createClient()

    const {data,error} = await supabase.from('categories').insert([
        {
            name: name,
            user_id: userId
        }]
    ).select()

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: `Category added: ${name}`,
        data: data
    }
}

export async function additem(item: Item, userId: string) {
   if((!item.name || item.name.length < 1) || (!item.category_id || item.category_id < 0) || (!item.location_id || item.location_id < 0) || (!item.container_id || item.container_id < 0)) {
       return {
           success: false,
           message: "item name, category id, location id and/or container id cannot be empty"
       }
   }
   const supabase = createClient()
   const {data, error} = await supabase.from('items').insert([
       {
           name: item.name,
           category_id: item.category_id,
           location_id: item.location_id,
           container_id: item.container_id,
           description: item.description,
           purchase_date: item.purchase_date,
           original_price: item.original_price,
           warranty_info: item.warranty_info,
           user_id: userId
       }
   ])
       .select(`
           *,
           categories:category_id(id,name),
           locations:location_id(id,name),
           containers:container_id(id,name)
       `
       )
   if (error) {
       return {
           success: false,
           message: error.message
       }
   }
   return {
       success: true,
       message: `Item added: ${item.name}`,
       data: data
   }
}

export async function getItemsForUser(userId: string) {
   if(!userId || userId.length < 1)
       return {
           success: false,
           message: "user id cannot be empty"
       }
   const supabase = createClient()
   const {data, error} = await supabase.from('items')
       .select(`
           *,
           categories:category_id(id,name),
           locations:location_id(id,name),
           containers:container_id(id,name)
       `)
       .eq('user_id', userId)
   if (error) {
       return {
           success: false,
           message: error.message
       }
   }
   return {
       success: true,
       message: "Items retrieved",
       data: data
   }
}



