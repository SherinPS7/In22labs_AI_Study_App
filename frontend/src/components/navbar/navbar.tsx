const Logo = '/dark1-logo.svg'
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import LogoutButton from './logout-button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Navbar = () => {
    const selector = useSelector((state : RootState) => state.auth);
  return (
    <div className="flex min-h-[10vh] justify-between items-center px-4 w-full">
        <Link to={"/"} className='flex flex-row gap-1 items-center'>
            <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
            <h1 className='text-xl font-semibold text-foreground tracking-tight'>StudyApp</h1>
        </Link>
        
        <main className='flex items-center gap-3'>
        <>
                <Button variant={"outline"} size={"sm"} asChild>
                    <Link to={"/sign-in"}>
                        Login
                    </Link>
                </Button>
                <Button variant={"default"} size={"sm"} asChild>
                    <Link to={"/sign-up"}>
                        Get Started
                    </Link>
                </Button>
            </>
        </main>
    </div>
  )
}

export default Navbar