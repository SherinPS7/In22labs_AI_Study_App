import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Loader, Pen } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateEventTypes } from '@/types/events-types'
import { createEventsSchema } from '@/schemas/events-schemas'
import { AppErrClient } from '@/utils/app-err'
import { Form } from '../ui/form'

const UpdateEventDialog = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<CreateEventTypes>({
        resolver : zodResolver(createEventsSchema),
        defaultValues : {

        }
    });

    const onSubmit = async (values : CreateEventTypes) => {
        try {
            setLoading(true);
            console.log(values);
        } catch (error) {
            AppErrClient(error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
                <Pen className='h-4 w-4' />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Update Event
                </DialogTitle>
                <DialogDescription>
                    Manage your events from volquix conected smoothly with your google calendar
                </DialogDescription>
            </DialogHeader>
            <section className='my-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"} size={"sm"}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={loading} variant={"default"} size={"sm"}>
                                {loading ? <>
                                    <Loader className='animate-spin mr-1 h-4 w-4' />
                                    updating..
                                </> : <>
                                <Pen className='mr-1 h-4 w-4' />
                                    Update
                                </>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </section>
        </DialogContent>
    </Dialog>
  )
}

export default UpdateEventDialog