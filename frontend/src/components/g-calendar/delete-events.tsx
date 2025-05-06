import { useState } from "react";
import { AppErrClient } from "@/utils/app-err";
import { Button } from "../ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { Loader, Trash } from "lucide-react";

const DeleteEventsDrawer = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
        } catch (error) {
            AppErrClient(error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
            <Button variant={"destructive"} size={"sm"}>
                <Trash className="h-4 w-4" />
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>
                    Delete Event
                </DrawerTitle>
                <DrawerDescription>
                    Are you sure you want to Delete an Event?
                </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex items-center flex-row justify-end gap-3">
                <DrawerClose asChild>
                    <Button variant={"outline"} size={"sm"}>Cancel</Button>
                </DrawerClose>
                <Button 
                    variant={"destructive"} 
                    size={"sm"}
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Logging out..</> : <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </>}
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default DeleteEventsDrawer