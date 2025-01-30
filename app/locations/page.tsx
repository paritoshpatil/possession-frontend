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
import {addContainer, addLocation, getAllContainers, getItemsForUser, getLocations} from "@/data/db-actions";
import {toast} from "sonner";
import {userStore} from "@/lib/userStore";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Container} from "@/models/container";
import {Item} from "@/models/item";
import {Location} from "@/models/location";

export default function Locations() {

    const [inputExpanded, setInputExpanded] = useState(false)
    const [locationInputValue, setLocationInputValue] = useState("")
    const [addLocationButtonLoading, setAddLocationButtonLoading] = useState(false)

    const [containerInputValue, setContainerInputValue] = useState("")
    const [addContainerButtonLoading, setAddContainerButtonLoading] = useState(false)

    const [locations, setLocations] = useState<Location[]>([])
    const [containers, setContainers] = useState<Container[]>([])
    const [items, setItems] = useState<Item[]>([])

    const inputRef = useRef<any>(null)

    const {user} = userStore()

    useEffect(() => {
        getLocationsForUser()
        getAllContainersForUser()
        getAllItemsForUser()
    }, [user])

    async function getLocationsForUser() {
        let response = await getLocations(user?.id ?? "")
        if(response.success && response.data) {
            setLocations(response.data.sort((a, b) => { return a.item_count > b.item_count ? -1 : 1 }))
        }
    }

    async function getAllContainersForUser() {
        let response = await getAllContainers(user?.id ?? "")
        if(response.success && response.data) {
            setContainers(response.data)
        }
    }

    async function getAllItemsForUser() {
        let response = await getItemsForUser(user?.id ?? "")
        if(response.success && response.data) {
            setItems(response.data)
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

    function getColspanFromItems(count: number): number {
        const maxItems = Math.max(...locations.map(location => location.item_count));
        const ratio = count / maxItems;

        if (ratio < 0.3) return 2
        else if (ratio >= 0.3 && ratio < 0.6) return 3
        else if (ratio >= 0.6 && ratio <= 1.0) return 4
        else return -1
    }

    async function expandAndFocusInput() {
        if(!inputExpanded) {
            setInputExpanded(true)
            inputRef.current.focus()
        }

        else {
            setAddLocationButtonLoading(true)
            let response = await addLocation(locationInputValue, user?.id ?? "")
            setAddLocationButtonLoading(false)
            if(response.success) {
                setInputExpanded(false)
                setLocationInputValue("")
                toast.success(response.message, {duration: 3000})
                await getLocationsForUser()
            }
            else {
                toast.error(response.message, {duration: 3000})
            }
        }
    }

    function hideAndClearInput() {
        setInputExpanded(false)
        setLocationInputValue("")
    }

    async function addContainerToLocation(e: React.FormEvent<HTMLFormElement>, locationId: string) {
        e.preventDefault()
        setAddContainerButtonLoading(true)
        let response = await addContainer(containerInputValue, locationId, user?.id ?? "")
        setAddContainerButtonLoading(false)
        if(response && response.success) {
            toast.success(response.message, {duration: 3000})
            setContainerInputValue("")
            await getLocationsForUser()
            await getAllContainersForUser()
            await getAllItemsForUser()
        }
        else {
            toast.error(response.message, {duration: 3000})
        }
    }

    function getContainersForLocation(locationId: number) {
        return containers.filter(container => container.location_id === locationId)
    }

    function getItemsForLocation(locationId: number) {
        return items.filter(item => item.location_id === locationId)
    }

    return (
        <main className='w-screen h-screen items-main bg-muted/40 overflow-y-auto'>
            <div className="flex flex-row justify-between items-center w-full mb-8">
                <h1 className="text-5xl text-foreground font-bold mb-4">Rooms</h1>
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
                               onChange={(e ) => setLocationInputValue(e.target.value)}
                               value={locationInputValue}
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
            <div className="w-full grid grid-cols-12 gap-4 locations-grid">
                {
                    locations.map(location => {
                        let key : string = location.name || "Unnamed Room"
                        const Icon = getIconForRoom(key)
                        const containersForLocation = getContainersForLocation(location.id)
                        const itemsForLocation = getItemsForLocation(location.id)
                        const colSpan = getColspanFromItems(location.item_count).toString()
                        return (
                            <Dialog key={key}>
                                    <Card className={`location-col-span-${colSpan} flex flex-col min-w-40 aspect-square`}>
                                        <CardHeader className="flex flex-row justify-between items-center">
                                            <CardTitle>{key}</CardTitle>
                                            <Icon className="w-8 h-8"/>
                                        </CardHeader>
                                        <CardContent>
                                            <ul>
                                                <li>{`${containersForLocation.length} container(s)`}</li>
                                                <li>{`${location.item_count} item(s)`}</li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter className='mt-auto flex justify-between'>
                                            <DialogTrigger asChild>
                                                <Button>details</Button>
                                            </DialogTrigger>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline"
                                                            className="flex flex-row items-center gap-2">
                                                        <LucidePlus className="w-6 h-6"/>
                                                        {   parseInt(colSpan) > 2 &&
                                                            'container'
                                                        }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="flex flex-col gap-2 w-80 p-4 shadow-lg shadow-foreground/10">

                                                    <h4 className="font-medium leading-none">new container</h4>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        add a new container to <span className="text-orange-500">{location.name}</span>
                                                    </p>
                                                    <form className="flex flex-col gap-2 justify-center" onSubmit={(e) =>addContainerToLocation(e, location.id.toString())}>
                                                        <Input
                                                            placeholder="container name"
                                                            className="w-full mb-2"
                                                            onChange={(e) => setContainerInputValue(e.target.value)}
                                                            value={containerInputValue}
                                                        />
                                                        <Button variant="default" type="submit">
                                                            {
                                                                addContainerButtonLoading ?
                                                                    <Loader2 className="w-6 h-6 animate-spin"/>
                                                                    :
                                                                    <LucidePlus className="w-6 h-6"/>
                                                            }
                                                            add
                                                        </Button>
                                                    </form>
                                                    <p className="text-sm text-muted-foreground mt-4">
                                                        click outside the popover or press escape to cancel
                                                    </p>
                                                </PopoverContent>
                                            </Popover>
                                        </CardFooter>
                                    </Card>

                                <DialogContent>
                                    <DialogHeader className="text-orange-500">
                                        {key}
                                    </DialogHeader>
                                    <DialogDescription>
                                        containers in {key}
                                        <ol className="list-decimal list-inside mt-4">
                                        {
                                            containersForLocation.map(container => {
                                                return (
                                                    <li key={container.id}>
                                                        {container.name}
                                                    </li>
                                                )
                                            })
                                        }
                                        </ol>
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
