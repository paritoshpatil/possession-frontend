'use server'
import { Button } from '@/components/ui/button';
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';
import {itemsData} from "@/data/items-data";
import {createClient} from "@/lib/supabaseServer";
import {redirect} from "next/navigation";
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

export default async function Items() {
	let doItemsExist: boolean = true;
	const supabase = createClient()

	const {data: {user}} = await supabase.auth.getUser()

	if(!user) {
		redirect("/login")
	}
	return (
		<main className='w-screen h-screen items-main bg-muted/40'>
			<Dialog>
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-5xl text-foreground font-bold mb-4">Items</h1>
				<DialogTrigger asChild>
					<Button className="mt-4" variant="default">
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
					<NewItemDialog/>
				</DialogContent>
			</div>
			{
				doItemsExist 
				? 
				<div className="relative w-full h-[86%] mb-4">
					 <DataTable columns={columns} data={itemsData}/>
				</div>
				:
				<div className="w-full h-[90%] shadow-lg rounded-lg text-foreground border-muted-foreground/40 border-dashed border-2 p-8 flex flex-col items-center justify-center">
					<h3 className="text-3xl font-bold">You have no items</h3>
					<p className="text-muted-foreground">start by adding some rooms, containers and items</p>
					<Button className="mt-4" variant="default">Add Item</Button>
				</div>
			}
			</Dialog>
		</main>
	)
}

export type Item = {
	itemId: number
	name: string
	description: string
	purchaseDate: string
	originalPrice: number
	warrantyInfo: string
	categoryId: number
	locationId: number
	containerId: number
}