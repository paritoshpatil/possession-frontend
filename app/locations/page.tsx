'use client'
import React, {useEffect, useRef, useState} from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Loader2,
    LucideAntenna,
    LucideBath, LucideBed,
    LucideCar,
    LucideCheck,
    LucideCookingPot, LucideCross,
    LucideFlower, LucideGhost, LucidePlus,
    LucideSofa, LucideX
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {motion} from "framer-motion";
import {addLocation, getLocations} from "@/data/db-actions";
import {toast} from "sonner";
import {userStore} from "@/lib/userStore";

export default function Locations() {

    const [inputExpanded, setInputExpanded] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [addLocationButtonLoading, setAddLocationButtonLoading] = useState(false)
    const [locations, setLocations] = useState([])
    const inputRef = useRef<any>(null)
    const {user} = userStore()


    // var locations = new Map()
    // itemsData.forEach((item: Item) => {
    //     if (!locations.get(item.locationId)) {
    //         locations.set(item.locationId, 1)
    //     }
    //     else {
    //         locations.set(item.locationId, locations.get(item.locationId) + 1)
    //     }
    // })

    useEffect(() => {
        getLocationsForUser()
    }, [user])

    async function getLocationsForUser() {
        console.log("user")
        console.log(user?.id)
        var response = await getLocations(user?.id)
        if(response.success) {
            console.log("locations retrieved")
            console.log(response.data)
            setLocations(response.data)
        }
    }

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

    function getColspanFromItems(count: number): string {
        if (count < 1) return "1"
        else if (count > 0 && count < 10) return "3"
        else if (count > 10 && count < 20) return "4"
        else return "6"
    }

    function getRowspanFromItems(count: number): string {
        if (count < 1) return "1"
        else if (count > 0 && count < 10) return "1"
        else if (count > 10 && count < 20) return "1"
        else return "2"
    }

    async function expandAndFocusInput() {
        if(!inputExpanded) {
            setInputExpanded(true)
            inputRef.current.focus()
        }

        else {
            setAddLocationButtonLoading(true)
            let response = await addLocation(inputValue, user?.id)
            setAddLocationButtonLoading(false)
            if(response.success) {
                setInputExpanded(false)
                setInputValue("")
                toast.success(response.message, {duration: 3000})
                getLocationsForUser()
            }
            else {
                toast.error(response.message, {duration: 3000})
            }
        }
    }

    function hideAndClearInput() {
        setInputExpanded(false)
        setInputValue("")
    }

    return (
        <main className='w-screen h-screen items-main bg-muted/40'>
            <div className="flex flex-row justify-between items-center w-full mb-8">
                <h1 className="text-5xl text-foreground font-bold mb-4">Locations</h1>
                <div className="flex flex-row justify-end items-center gap-2 w-1/2">
                    <motion.div
                        initial={{
                            opacity: 0,
                            width: 0,
                        }}
                        animate={{
                            opacity: inputExpanded ? 1 : 0,
                            width: inputExpanded ? "50%" : "0",
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}

                        className='flex flex-row items-center gap-2'
                    >
                        <Input className="w-full"
                               placeholder="add a room name"
                               ref={inputRef}
                               onChange={(e ) => setInputValue(e.target.value)}
                               value={inputValue}
                               />
                    </motion.div>

                    {
                        inputExpanded &&
                        <Button variant="destructive"
                                onClick={hideAndClearInput}
                                className='flex flex-row items-center justify-center gap-2 '
                        >
                            <LucideX className="w-6 h-6"/>
                            cancel
                        </Button>
                    }

                    <Button className='flex flex-row items-center justify-center gap-2 w-36'
                            onClick={expandAndFocusInput}
                    >

                        {
                            addLocationButtonLoading ?
                                <Loader2 className="w-6 h-6 animate-spin"/>
                                :
                            inputExpanded ?
                                <LucideCheck className="w-6 h-6"/>
                                    :
                                <LucidePlus className="w-6 h-6"/>

                        }
                        {inputExpanded ? "confirm" : "add location"}
                    </Button>
                </div>
            </div>
            <div className="w-full grid grid-cols-12 grid-rows-auto gap-4 locations-grid">
                {
                    locations.map(location => {
                        var key : string = location.name || "Unnamed Room"
                        const Icon = getIconForRoom(key)
                        return (
                            <Dialog key={key}>
                                    <Card className={`location-col-span-${getColspanFromItems(1)} location-row-span-${getRowspanFromItems(1)} flex flex-col`}>
                                        <CardHeader className="flex flex-row justify-between items-center">
                                            <CardTitle>{key}</CardTitle>
                                            <Icon className="w-8 h-8"/>
                                        </CardHeader>
                                        <CardContent>
                                            <ul>
                                                <li>{`${location.id} items`}</li>
                                                <li>{`${location.id} containers`}</li>
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
