import React from 'react'
import { Item } from '../items/page'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {itemsData} from "@/data/items-data";
import {locationIDToName} from "@/data/location-id-to-name";
import {
    LucideAntenna,
    LucideBath, LucideBed,
    LucideCar,
    LucideCookingPot,
    LucideFlower, LucideGhost,
    LucideSofa
} from "lucide-react";
export default function Locations() {

    // var locations = itemsData.map((item: Item) => item.locationId).filter((x, i, a) => a.indexOf(x) == i)
    var locations = new Map()
    itemsData.forEach((item: Item) => {
        if (!locations.get(item.locationId)) {
            locations.set(item.locationId, 1)
        }
        else {
            locations.set(item.locationId, locations.get(item.locationId) + 1)
        }
    })

    console.log(locations)

    function getIconForRoom(roomName: string) {
        if(!roomName || roomName.length < 1) return LucideGhost;

        roomName = roomName.toLowerCase()

        if(roomName.includes("living")) return LucideSofa;
        else if(roomName.includes("bed")) return LucideBed;
        else if(roomName.includes("kitchen")) return LucideCookingPot;
        else if(roomName.includes("bath") || roomName.includes("wash") || roomName.includes("toilet")) return LucideBath;
        else if(roomName.includes("garage") || roomName.includes("car")) return LucideCar;
        else if(roomName.includes("garden") || roomName.includes("yard")) return LucideFlower;
        else if(roomName.includes("balcony") || roomName.includes("terrace")) return LucideAntenna;
        else return LucideGhost;
    }

    // locations.set("Living Room", 25)
    // locations.set("Balcony", 15)
    // locations.set("Garage", 15)
    // locations.set("Bedroom", 9)
    // locations.set("Garden", 9)
    // locations.set("Kitchen", 4)
    // locations.set("Washroom", 4)

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
                    Array.from(locations.keys()).map(locationId => {
                        var key : string = locationIDToName.get(locationId) || "Unnamed Room"
                        const Icon = getIconForRoom(key)
                        return (
                            <Dialog key={key}>
                                    <Card className={`location-col-span-${getColspanFromItems(locations.get(locationId))} location-row-span-${getRowspanFromItems(locations.get(locationId))} flex flex-col`}>
                                        <CardHeader className="flex flex-row justify-between items-center">
                                            <CardTitle>{key}</CardTitle>
                                            <Icon className="w-8 h-8"/>
                                        </CardHeader>
                                        <CardContent>
                                            <ul>
                                                <li>{`${locations.get(locationId)} items`}</li>
                                                <li>{`${locations.get(locationId)} containers`}</li>
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
