import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from '@/assets/logo.png';
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Footer() {
    const quicklinks = [{
        text : "Home",
        link : "/"
    }, {
        text : "Pricing",
        link : "/pricing",
    }, {
        text : "Privacy Policy",
        link : "/privacy-policy"
    }, {
        text : "Contact Us",
        link : "/contact-us"
    }];

    const SocialLinks = [{
        icon : Twitter,
        link : "#"
    }, {
        icon : Facebook,
        link : "#"
    }, {
        icon : Instagram,
        link : "#"
    }, {
        icon : Linkedin,
        link : "#"
    }];

    const getFullyear = () => {
        const date = new Date();
        return date.getFullYear();
    };

    return (
        <footer className="min-h-[30vh] py-4 text-center md:flex-row flex-wrap md:justify-between flex flex-col max-w-7xl mx-auto gap-y-6 md:gap-y-0">
            <Link to={"/"} className='flex flex-row gap-1 items-center text-center justify-center md:text-start md:justify-start'>
                <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                <h1 className='text-xl font-semibold text-foreground tracking-tight'>StudyApp</h1>
            </Link>

            <main className="flex flex-row gap-7 items-center justify-center">
                {quicklinks.map((content, index) => (
                    <Button variant={"link"} key={index} size={"sm"}>
                        <Link to={content.link}>
                            {content.text}
                        </Link>
                    </Button>
                ))}
            </main>

            <main className="flex flex-row gap-3 items-center justify-center">
                {SocialLinks.map((content, index) => (
                    <main className="border hover:bg-blue-500 transition-all duration-200 ease-in-out rounded-full p-2">
                        <Link key={index} className="text-sm font-medium text-foreground" to={content.link}>
                            <content.icon className="h-4 w-4" />
                        </Link>
                    </main>
                ))}
            </main>

            <Separator className="" />

            <main className="text-center w-full">
                <p className="text-sm font-light text-muted-foreground tracking-tight leading-tight">&copy; Copyright {getFullyear()}, All Rights Reserved by Study App</p>
            </main>
        </footer>
    )
}