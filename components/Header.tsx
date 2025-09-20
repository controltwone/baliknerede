import Logo from "@/components/Logo";
import Menu from "@/components/Menu";

export default function Header(props : any){
    return <>
            {props.name}
            <Logo />
            <Menu />

            </>
}