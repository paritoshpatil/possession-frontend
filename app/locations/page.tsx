import React from 'react'
import { Item } from '../items/page'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
        if (count < 1) return "0"
        else if (count > 0 && count < 10) return "3"
        else if (count > 10 && count < 20) return "4"
        else return "6"
    }

    function getRowspanFromItems(count: number): string {
        if (count < 1) return "0"
        else if (count > 0 && count < 10) return "1"
        else if (count > 10 && count < 20) return "1"
        else return "2"
    }

    return (
        <main className='w-screen items-main bg-muted/40'>
            <h1 className="text-5xl text-foreground font-bold mb-4">Locations</h1>
            <div className="w-full grid grid-cols-12 grid-rows-auto gap-4 locations-grid">
                {
                    Array.from(locations.keys()).map(key => {
                        return (
                            <Dialog>
                                    <Card className={`location-col-span-${getColspanFromItems(locations.get(key))} location-row-span-${getRowspanFromItems(locations.get(key))} flex flex-col`}>
                                        <CardHeader>
                                            <CardTitle>{key}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul>
                                                <li>{`${locations.get(key)} items`}</li>
                                                <li>{`${locations.get(key)} containers`}</li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter className='mt-auto flex justify-between'>
                                            <DialogTrigger asChild>
                                                <Button>details</Button>
                                            </DialogTrigger>
                                        </CardFooter>
                                    </Card>
                                
                                <DialogContent>
                                    <DialogHeader>
                                        {key}
                                    </DialogHeader>
                                    <DialogDescription>
                                        containers in {key}
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        )
                    })
                }
            </div>
        </main>
    )
}
