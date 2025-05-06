import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Loader, User, UserCheck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { avatars } from '@/config/appwrite'
import { AppErrServer } from '@/utils/app-err'
import { createVerification } from '@/api/auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { formatDate } from '@/utils/format-date'

const ProfileDialog = () => {
    const authInfo = useSelector((state : RootState) => state.auth);

    const fetchAvatarImage = () => {
        return avatars.getInitials(authInfo.userData.name as string);
    }

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function createEmailVerification() {
        try {
            setLoading(true);
            const response = await createVerification();
            if (response?.$id) {
                toast({
                    title : "Success",
                    description : "Verification has been sent to your mail"
                })
            };
            
            navigate("/verify-user");
        } catch (error) {
            AppErrServer(error);
        } finally {
            setLoading(false);
        }
    }
  return (
    <Dialog>
        <DialogTrigger>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={"outline"} size={"sm"}>
                        <User className='h-4 w-4' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Profile
                </TooltipContent>
            </Tooltip>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    User Profile
                </DialogTitle>
                <DialogDescription>
                    Manage user profile, edit and secure your data
                </DialogDescription>
            </DialogHeader>
            <main className='my-4 space-y-3'>
                <section className=' flex justify-start gap-6 items-center'>
                    <img src={fetchAvatarImage()} alt='U' className='w-24 h-24 rounded-full object-contain' />
                    <main className='flex flex-col gap-2 justify-start'>
                        <h1 className='text-xl font-semibold text-foreground tracking-tight'>
                            {authInfo.userData.name}
                        </h1>
                        <p className='text-sm font-medium text-muted-foreground'>
                            {authInfo.userData.email}
                        </p>
                    </main>
                </section>
            </main>
            <DialogFooter className='flex justify-between items-center flex-row w-full gap-6'>
                <p className='text-sm font-light text-muted-foreground tracking-tight'>
                    User created At {formatDate(authInfo.userData.$createdAt)}
                </p>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} onClick={createEmailVerification} size={"sm"} disabled={authInfo.userData.emailVerification}>
                            {loading ? <Loader className='animate-spin w-4 h-4' /> : <UserCheck className='w-4 h-4' />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Verify Email
                    </TooltipContent>
                </Tooltip>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog