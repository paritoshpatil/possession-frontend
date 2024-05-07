import React from 'react'
import { Item } from '../items/page'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Locations() {
    const itemsData: Item[] = [
        {
            "itemId": 1,
            "name": "Plum Sunsreen Tube",
            "description": "White tube, SPF 50",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 300.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 2,
            "name": "Plum Hand Lotion",
            "description": "Yellow Tube, Blue Cap, Hawaiian Rumba Flavor",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 270.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 3,
            "name": "Axe After Shave Lotion",
            "description": "Black Glass Bottle, Denim fragrance",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 120.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 2
        },
        {
            "itemId": 4,
            "name": "Yeezy Wave Runners",
            "description": "Blue Black White shoes, Neon Green laces, Gel insole",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 4800.00,
            "warrantyInfo": "None",
            "categoryId": 3,
            "locationId": 2,
            "containerId": 5
        },
        {
            "itemId": 1,
            "name": "Plum Sunsreen Tube",
            "description": "White tube, SPF 50",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 300.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 2,
            "name": "Plum Hand Lotion",
            "description": "Yellow Tube, Blue Cap, Hawaiian Rumba Flavor",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 270.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 3,
            "name": "Axe After Shave Lotion",
            "description": "Black Glass Bottle, Denim fragrance",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 120.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 2
        },
        {
            "itemId": 4,
            "name": "Yeezy Wave Runners",
            "description": "Blue Black White shoes, Neon Green laces, Gel insole",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 4800.00,
            "warrantyInfo": "None",
            "categoryId": 3,
            "locationId": 2,
            "containerId": 5
        },
        {
            "itemId": 1,
            "name": "Plum Sunsreen Tube",
            "description": "White tube, SPF 50",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 300.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 2,
            "name": "Plum Hand Lotion",
            "description": "Yellow Tube, Blue Cap, Hawaiian Rumba Flavor",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 270.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 1
        },
        {
            "itemId": 3,
            "name": "Axe After Shave Lotion",
            "description": "Black Glass Bottle, Denim fragrance",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 120.00,
            "warrantyInfo": "None",
            "categoryId": 1,
            "locationId": 1,
            "containerId": 2
        },
        {
            "itemId": 4,
            "name": "Yeezy Wave Runners",
            "description": "Blue Black White shoes, Neon Green laces, Gel insole",
            "purchaseDate": "2024-03-29T19:24:17.272",
            "originalPrice": 4800.00,
            "warrantyInfo": "None",
            "categoryId": 3,
            "locationId": 2,
            "containerId": 5
        },
    ]

    // var locations = itemsData.map((item: Item) => item.locationId).filter((x, i, a) => a.indexOf(x) == i)
    var locations = new Map()
    // itemsData.forEach((item: Item) => {
    //     if (!locations.get(item.locationId)) {
    //         locations.set(item.locationId, 1)
    //     }
    //     else {
    //         locations.set(item.locationId, locations.get(item.locationId) + 1)
    //     }
    // })

    locations.set("Living Room", 25)
    locations.set("Balcony", 15)
    locations.set("Garage", 15)
    locations.set("Bedroom", 9)
    locations.set("Garden", 9)
    locations.set("Kitchen", 4)
    locations.set("Washroom", 4)

    function getColspanFromItems(count: number): string {
        if (count < 5) return "2"
        else if (count > 5 && count < 10) return "3"
        else if (count > 10 && count < 20) return "4"
        else return "6"
    }

    return (
        <main className='w-screen items-main bg-muted/40'>
            <h1 className="text-5xl text-foreground font-bold mb-4">Locations</h1>
            <div className="w-full grid grid-cols-12 grid-rows-12 gap-4">
                {
                    Array.from(locations.keys()).map(key => {
                        return (
                            // <div className={`border border-solid border-muted-foreground location-col-span-${getColspanFromItems(locations.get(key))}`}>
                            //     {key}
                            // </div>

                            <Card className={`location-col-span-${getColspanFromItems(locations.get(key))} location-row-span-${getColspanFromItems(locations.get(key))}`}>
                                <CardHeader>
                                    <CardTitle>{key}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{`item count: ${locations.get(key)}`}</p>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        </main>
    )
}
