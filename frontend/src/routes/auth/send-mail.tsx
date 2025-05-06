import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { AppErrClient } from "@/utils/app-err"
import { createPasswordRecovery } from "@/api/auth"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const sendmailSchema = z.object({
    email : z.string().email({
        message : "Enter a valid email address"
    }),
});

type sendMailTypes = z.infer<typeof sendmailSchema>;

const SendMail = () => {
    const form = useForm<sendMailTypes>({
        resolver : zodResolver(sendmailSchema),
        defaultValues : {
            email : "",
        }
    });

    const navigate = useNavigate();

    const onSubmit = async (values : sendMailTypes) => {
        try {
            const response = await createPasswordRecovery(values.email);
            if (response?.$id) {
                toast({
                    title : "Success",
                    description : "Verification has been sent to your email"
                })
            };

            navigate("/reset-password");
        } catch (error) {
            AppErrClient(error);
        }
    }
  return (
    <div className="min-h-[90vh] flex justify-center items-center w-full px-2">
        <Card>
            <CardHeader>
                <CardTitle>
                    Reset Password - Step 1
                </CardTitle>
                <CardDescription>
                    Enter a valid email address to reset your password properly.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="email" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="johndoe@example.com" type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <CardFooter className="flex w-full">
                            <Button disabled={form.formState.isSubmitting} variant={"default"} className="w-full">
                                {form.formState.isSubmitting ? <>
                                    <Loader className="mr-2 w-4 h-4 animate-spin" />
                                    Loading...
                                </> : <>
                                    Submit
                                </>}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
                <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary hover:underline font-medium">
                Sign up
            </Link> 
            </p>
            </CardContent>
           
        </Card>
    </div>
  )
}

export default SendMail