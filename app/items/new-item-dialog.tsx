'use client'
import {z} from "zod";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover-modal";
import {Button} from "@/components/ui/button";
import {CalendarIcon, LucideIndianRupee} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {userStore} from "@/lib/userStore";
import {getContainersForLocation, getLocations} from "@/data/db-actions";

export default function NewItemDialog() {
    const {user} = userStore()

    const [locations, setLocations] = useState([])
    const [containers, setContainers] = useState([])

    useEffect(() => {
        getLocationsForUser()
    }, [user])

    async function getLocationsForUser() {
        var response = await getLocations(user?.id)
        if(response.success) {
            setLocations(response.data)
        }
    }

    const itemFormSchema = z.object({
        name: z.string().min(1).max(50, "Name must be between 1 and 50 characters"),
        description: z.string().min(1).max(500).optional().nullish(),
        purchaseDate: z.date().optional(),
        originalPrice: z.number().min(0).optional(),
        warrantyInfo: z.string().min(1).max(500).optional().nullish(),
        categoryId: z.string().min(1).max(1000).optional().nullish(),
        locationId: z.string().min(1).max(1000),
        containerId: z.string().min(1).max(1000),
    })

    const itemForm = useForm<z.infer<typeof itemFormSchema>>({
        resolver: zodResolver(itemFormSchema),
        defaultValues: {
            description: null,
            originalPrice: 0,
            warrantyInfo: null,
            categoryId: null,
            purchaseDate: new Date(),
        },
    })

    const locationChanged = (e: any) => {
        getContainersForLocation(e, user?.id).then(response => {
            if(response.success) {
                setContainers(response.data)
            }
        })
    }

    function onSubmit(values: z.infer<typeof itemFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return(
        <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={itemForm.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Item Name <span className="text-orange-500">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="bluetooth speakers" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={itemForm.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Item Description</FormLabel>
                            <FormControl>
                                <Input placeholder="wireless white speakers with bluetooth" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center w-full justify-between space-x-4">
                    <FormField
                        control={itemForm.control}
                        name="purchaseDate"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Purchase Date</FormLabel>
                                <br/>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" side="bottom" avoidCollisions={false}>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={itemForm.control}
                        name="originalPrice"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Original Cost</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row items-center gap-2">
                                        <LucideIndianRupee className="w-5 h-5"/>
                                        <Input type="number" placeholder="500" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                </div>


                <FormField
                    control={itemForm.control}
                    name="warrantyInfo"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Warranty Info</FormLabel>
                            <FormControl>
                                <Input placeholder="2 year warranty, free repairs" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center w-full justify-between space-x-4">

                    <FormField
                        control={itemForm.control}
                        name="locationId"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Location <span className="text-orange-500">*</span></FormLabel>
                                <Select onValueChange={(e) => {
                                    locationChanged(e);
                                    field.onChange(e)
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the location to place your item"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            locations.map(location => {
                                                return (
                                                    <SelectItem key={location.id}
                                                                value={location.id.toString()}>{location.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={itemForm.control}
                        name="containerId"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Container <span className="text-orange-500">*</span></FormLabel>
                                {
                                    containers.length > 0 ?
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a container in your location"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    containers.map(container => {
                                                        return (
                                                            <SelectItem key={container.id}
                                                                        value={container.id.toString()}>{container.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        :
                                        <p className="text-sm">Please select a location first</p>
                                }
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                    <Button variant="default" onClick={itemForm.handleSubmit(onSubmit)}>Add Item</Button>
            </form>
        </Form>
)
}