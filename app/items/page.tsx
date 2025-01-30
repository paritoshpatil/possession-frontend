'use client'
import { Button } from '@/components/ui/button';
import React, {useState, useEffect, Suspense} from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';
import {LucidePlus} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import NewItemDialog from "@/app/items/new-item-dialog";
import {Item, ItemRow} from "@/models/item";
import {userStore} from "@/lib/userStore";
import {getItemsForUser} from "@/data/db-actions";
import {Skeleton} from "@/components/ui/skeleton";

export default function Items() {

	const {user} = userStore()

	const [items, setItems] = useState<ItemRow[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const newItemAdded = (newItem: ItemRow) => {
		setItems([...items, newItem])
	}

	useEffect(() => {
		getItemsForUser(user?.id ?? "").then(response => {
			setIsLoading(false)
			if(response.success && response.data) {
				response.data.forEach(item => {
					item.category_name = item.categories.name
					item.location_name = item.locations.name
					item.container_name = item.containers.name
				})

				console.log(response.data)
				setItems(response.data)
			}
		}).catch(error => {
			setIsLoading(false)
			console.log(error)
		})
	}, [user])
	return (
		<main className='w-screen h-screen items-main bg-muted/40'>
			<Dialog>
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-5xl text-foreground font-bold mb-4">Things</h1>
				<DialogTrigger asChild>
					<Button className="mb-4" variant="default">
						<LucidePlus className="w-5 h-5 mr-2"/>
						Add a new item
					</Button>
				</DialogTrigger>
				<DialogContent className="min-w-[800px]">
					<DialogHeader>
						<DialogTitle>Add new item</DialogTitle>
						<DialogDescription>
							Mandatory fields are marked with an <span className="text-orange-500">asterisk*</span>
						</DialogDescription>
					</DialogHeader>
					<NewItemDialog onItemAdded={newItemAdded}/>
				</DialogContent>
			</div>
			{
				isLoading
					? <Skeleton className="w-full h-[86%] mb-4" />
					: items.length > 0
						?
						<div className="relative w-full h-[86%] mb-4">
							 <DataTable columns={columns} data={items}/>
						</div>
						:
						<div className="w-full h-[90%] shadow-lg rounded-lg text-foreground border-muted-foreground/40 border-dashed border-2 p-8 flex flex-col items-center justify-center mt-4">
							<h3 className="text-3xl font-bold">You have no items</h3>
							<p className="text-muted-foreground">start by adding some locations, containers and items</p>
						</div>
			}
			</Dialog>
		</main>
	)
}

