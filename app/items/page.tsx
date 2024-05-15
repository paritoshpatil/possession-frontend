import { Button } from '@/components/ui/button';
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';
import {itemsData} from "@/data/items-data";

export default function Items() {
	var doItemsExist: boolean = true;

	return (
		<main className='w-screen h-screen items-main bg-muted/40'>
			<h1 className="text-5xl text-foreground font-bold mb-4">Items</h1>
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