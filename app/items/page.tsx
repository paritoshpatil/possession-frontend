import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

export default function Items() {
	var doItemsExist: boolean = true;

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
	const itemsDataEmpty: Item[] = []
	return (
		<main className='w-screen h-screen items-main bg-muted/40'>
			<h1 className="text-5xl text-foreground font-bold mb-4">Items</h1>
			{
				doItemsExist &&
				<div className="relative w-full h-[86%] mb-4">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4" />
					<Input
						type="search"
						placeholder="Search items..."
						className="w-full appearance-none pl-8 shadow-none mb-4"
					/>
					{/* <div className="relative items-container-full w-full h-full max-h-full overflow-scroll shadow-lg shadow-muted-foreground/20 rounded-lg text-foreground p-4 mt-4 border border-muted-foreground/40">
 					</div> */}
					 <DataTable columns={columns} data={itemsData}/>

				</div>
			}

			{
				!doItemsExist &&
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