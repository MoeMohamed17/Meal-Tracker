import { Button } from '@mantine/core'
import React from 'react'
import Link from 'next/link';
import styles from './NavBar.css'


const NavBar = () => {
    return (
        <header className="header">
            <div className="container">
                <Link href="/" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>Home
                    </Button>
                </Link>

                <Link href="/recipes" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)" 
                        size="lg" radius="xl" component='a'>Recipes
                    </Button>
                </Link>
                
                <Link href="/pantries" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>Pantries
                    </Button>
                </Link>

                <Link href="/myrecipes" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>My Recipes
                    </Button>
                </Link>

                <Link href="/newrecipes" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>Contribute
                    </Button>
                </Link>

                <Link href="/stats" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>Stats
                    </Button>
                </Link>

                <Link href="/admin" passHref>
                    <Button variant="filled" color="rgba(101, 85, 143, 1)"
                        size="lg" radius="xl" component='a'>Admin
                    </Button>
                </Link>
            </div>
        </header>
    )
}

export default NavBar

