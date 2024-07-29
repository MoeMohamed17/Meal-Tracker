import { Button } from '@mantine/core'
import React from 'react'
import Link from 'next/link';


const NavBar = () => {
    return (
        <header className="header">
            <div className="container">
                <Button variant="filled" color="rgba(101, 85, 143, 1)" size="lg" radius="xl" component='a' href='api/recipes'>Recipes</Button>
                <Button variant="filled" color="rgba(101, 85, 143, 1)" size="lg" radius="xl" component='a' href='api/pantries'>Pantries</Button>
                <Button variant="filled" color="rgba(101, 85, 143, 1)" size="lg" radius="xl" component='a' href='api/recipes'>My Favourites</Button>
                <Button variant="filled" color="rgba(101, 85, 143, 1)" size="lg" radius="xl" component='a' href='api/recipes'>Contribute</Button>
            </div>
        </header>
    )
}

export default NavBar