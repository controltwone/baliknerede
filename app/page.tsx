import Header from "@/components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Page() {
  const name = "Ferhat"
    return <>
             <Header name = {name}/>
             <h2>That's links: </h2>
             <div><Link href="/home"> HOME </Link></div>
             <div><Link href="/nav"> NAV </Link></div>
             <Button>Click me</Button>
           </>          

} 
          