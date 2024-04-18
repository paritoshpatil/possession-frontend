import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

export interface NavLinkType {
    link: string
    isActive?: boolean
    onClick?: any
    href: string
}

const NavLink = ({ link, href, isActive, onClick } : NavLinkType) => {
    return (
      <Link href={href} className={`nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={onClick} >
        <Button variant="ghost" className='text-lg font-regular text-foreground hover:bg-muted'>
          {link}
        </Button>
      </Link>
    );
  };

export default NavLink;