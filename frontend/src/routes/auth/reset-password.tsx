import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { AppErrClient } from "@/utils/app-err"
import { updatePasswordRecovery } from "@/api/auth"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { updatePasswordRecoverytypes } from "@/types/auth-types"
import { updatePasswordRecoverySchema } from "@/schemas/auth-schemas"

const ResetPassword = () => {
    const form = useForm<updatePasswordRecoverytypes>({
        resolver : zodResolver(updatePasswordRecoverySchema),
        defaultValues : {
            password : "",
            confirmpassword : ""
        }
    });

    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    const onSubmit = async (values : updatePasswordRecoverytypes) => {
        try {
            if (!userId || !secret) {
                throw new Error("Info not collected properly")
            };

            const payload = {
                userId: userId || "",
                secret : secret || "",
                password: values.password,
                confirmpassword: values.confirmpassword,
            };
            const response = await updatePasswordRecovery(payload);
            if (response?.$id) {
                toast({
                    title : "Success",
                    description : "The Password has been reset successfully"
                })
            };

            navigate("/sign-in");
        } catch (error) {
            AppErrClient(error);
        }
    }
  return (
    <div className="min-h-[90vh] flex justify-center items-center w-full px-2">
        <Card>
            <CardHeader>
                <CardTitle>
                    Reset Password - Step 2
                </CardTitle>
                <CardDescription>
                    Enter a strong password and probably use a password manager 😇 .
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="xxxxxxxx" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <FormField control={form.control} name="confirmpassword" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="xxxxxxxx" type="password" />
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
                                    Reset Password
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

export default ResetPassword