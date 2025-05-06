import { CreateUserTypes } from "@/types/auth-types"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUserSchema } from "@/schemas/auth-schemas"
import { AppErrClient } from "@/utils/app-err"
import { CreateUser } from "@/api/auth"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import OauthWrapper from "@/components/auth/oauth-wrapper"

const SignUp = () => {
    const form = useForm<CreateUserTypes>({
        resolver : zodResolver(CreateUserSchema),
        defaultValues : {
            firstname : "",
            lastname : "",
            email : "",
            password : ""
        }
    });

    const navigate = useNavigate();

    const onSubmit = async (values : CreateUserTypes) => {
        try {
            const response = await CreateUser(values);
            if (response) {
                toast({
                    title : "Success",
                    description : "User has been successfully created"
                })
            };

            navigate("/sign-in");
        } catch (error) {
            AppErrClient(error);
        }
    }
  return (
    <div className="min-h-[90vh] flex justify-center items-center w-full px-4 md:px-0 py-6">
        <Card>
            <CardHeader>
                <CardTitle>
                    Create an Account
                </CardTitle>
                <CardDescription>
                    Find inspiration, motivation, and more – Volquix crafts your perfect quote.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <main className="flex flex-col gap-4 items-center md:flex-row w-full">
                        <FormField control={form.control} name="firstname" render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Firstname
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="john" type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lastname" render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Lastname
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="doe" type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        </main>
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

                        <main className="flex flex-col gap-2">
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
                        </main>

                        <CardFooter className="flex w-full">
                            <Button disabled={form.formState.isSubmitting} variant={"default"} className="mt-3 w-full">
                                {form.formState.isSubmitting ? <>
                                    <Loader className="mr-2 w-4 h-4 animate-spin" />
                                    Loading...
                                </> : <>
                                    Sign Up
                                </>}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
            <div className="px-8 pb-8">
            <OauthWrapper />
                <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an Account?{" "}
                <Link to="/sign-in" className="text-primary hover:underline font-medium">
                    Sign in
                </Link> 
                </p>
            </div>
        </Card>
    </div>
  )
}

export default SignUp