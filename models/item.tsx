export type Item = {
    id?: number
    name: string
    description: string
    purchase_date: Date
    original_price: number
    warranty_info: string
    category_id: number
    location_id: number
    container_id: number
}

export type ItemRow = {
    id?: number
    name: string
    description: string
    purchase_date: Date
    original_price: number
    warranty_info: string
    category_name: string
    location_name: string
    container_name: string
}