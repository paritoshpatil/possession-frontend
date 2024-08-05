import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavLink, { NavLinkType } from './navLink';
import { Ghost, Paintbrush } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import {usePathname, useRouter} from 'next/navigation';
import {logout, getUser, revalidate} from "@/app/login/actions";
import {userStore} from "@/lib/userStore";

export default function NavBar() {
	const {theme, setTheme} = useTheme()

	const {user, setUser, isLoggedIn, setIsLoggedIn} = userStore((state: any) => state)
	const router = useRouter()

	async function getUserFromDB() {
		const response = await getUser()
		if(response.success && response.data) {
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
						(<p>Hello, {user.user_metadata?.full_name ? user.user_metadata.full_name : user.email}</p>)
					:
						(<p>Login to continue</p>)
				}

				{
					isLoggedIn ?
						(<Button onClick={() => logoutFromDB()}>
							Logout
						</Button>)
					:
						(<Button>
							<Link href={"/login"}>Login</Link>
						</Button>)
				}
				
				<Button onClick={() => toggleTheme()} variant="ghost">
					<Paintbrush width={20} height={20}/>
				</Button>


			</div>
        </nav>

    )
}
