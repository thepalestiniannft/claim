import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/logo.png'

export default function Navbar() {
    const address = useAddress();

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <div className={styles.redlogo}>
                    <a href="https://www.redthisis.com">
                        <Image
                            src={logo}
                            alt="logo"
                            width={48}
                            height={48}
                            />
                    </a>
                </div>
                <div className={styles.navLinks}>
                    {address && (<Link href={`profile/${address}`}>MY COLLECTION</Link>)}
                </div>
                <div className={styles.ConnectWallet}>
                    <ConnectWallet 
                        btnTitle="CONNECT WALLET"
                        className={styles.connectButton}
                    />
                </div>
            </div>
        </div>
    )
}