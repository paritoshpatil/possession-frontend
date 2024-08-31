import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavLink, { NavLinkType } from './navLink';
import { Ghost, LogOut, Paintbrush, Trash} from 'lucide-react';
import { useTheme } from 'next-themes';
import {usePathname, useRouter} from 'next/navigation';
import {logout, getUser, revalidate} from "@/app/login/actions";
import {userStore} from "@/lib/userStore";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem, DropdownMenuItemDanger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function NavBar() {
	const {theme, setTheme} = useTheme()

	const {user, setUser, isLoggedIn, setIsLoggedIn} = userStore((state: any) => state)
	const router = useRouter()

	async function getUserFromDB() {
		const response = await getUser()
		if(response.success && response['data']) {
			setUser(response['data'])
			setIsLoggedIn(true)
		}
	}

	async function logoutFromDB() {
		const success = await logout()
		if(success) {
			setUser(null)
			setIsLoggedIn(false)
			revalidate()
			router.push('/login')
		}
		else {
			revalidate()
			router.push('/error')
		}
	}

	useEffect(() => {
		getUserFromDB()
	}, [])

	function toggleTheme() {
		if(theme == 'light') setTheme('dark')
		else if(theme == 'dark') setTheme('light')
	}


	const links: NavLinkType[] = [
		{
			link: "home",
			href: "/",
		},
		{
			link: "items",
			href: "/items",
		},
		{
			link: "locations",
			href: "/locations",
		}
	]

	var currentPath : string = usePathname()
	var initialActiveLink: any = links.find(link => link.href == currentPath)
	const [activeLink, setActiveLink] = useState(initialActiveLink ? initialActiveLink.link : links[0].link);

	const handleLinkClick = (event: any) => {
		const clickedLink = event.target.innerText;
		setActiveLink(clickedLink);
	};

    return (
        <nav className='w-screen h-12 z-10 px-36 py-7 fixed backdrop-blur-md flex items-center justify-between'>
			<Ghost className='text-foreground'/>
			<div className="flex items-center justify-center space-x-16">
				{
					links.map((link, index) => {
						return <NavLink key={index} link={link.link} href={link.href} isActive={link.link === activeLink} onClick={handleLinkClick} />
					})
				}
			</div>
			<div className="flex items-center gap-4">
                {
                    isLoggedIn ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="w-9 h-9 hover:cursor-pointer">
								<AvatarImage src={`https://ui-avatars.com/api/?name=${user.user_metadata?.full_name ? user.user_metadata.full_name : user.email}&background=000&color=fff&size=128`}/>
								<AvatarFallback>PR</AvatarFallback>
							</Avatar>
                        </DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Hello, {user.user_metadata?.full_name ? user.user_metadata.full_name : user.email.split('@')[0]}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => toggleTheme()}>
								<Paintbrush className="mr-2 w-4 h-4"/>
								Toggle Theme
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => logoutFromDB()}>
								<LogOut className="mr-2 w-4 h-4"/>
								Logout
							</DropdownMenuItem>
							<DropdownMenuItemDanger>
								<Trash className="mr-2 w-4 h-4"/>
								Delete Your Account
							</DropdownMenuItemDanger>
						</DropdownMenuContent>
                    </DropdownMenu>
					:
					<span>
						<Link href={"/login"} className="underline">login</Link> to continue
					</span>
                }
			</div>
        </nav>

    )
}
