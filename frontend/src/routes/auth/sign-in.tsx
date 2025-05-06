import { LoginUserTypes } from "@/types/auth-types"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginUserSchema } from "@/schemas/auth-schemas"
import { AppErrClient } from "@/utils/app-err"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import OauthWrapper from "@/components/auth/oauth-wrapper"
import { useAuth } from "@/hooks/use-auth"

const SignIn = () => {
    const form = useForm<LoginUserTypes>({
        resolver : zodResolver(LoginUserSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    });

    const {loginMutation} = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (values : LoginUserTypes) => {
        try {
            const response = await loginMutation.mutateAsync(values);
            if (response) {
                toast({
                    title : "Success",
                    description : "User has been successfully logged in"
                })
            };

            navigate("/set-state");
        } catch (error) {
            AppErrClient(error);
        }
    }
  return (
    <div className="min-h-[90vh] flex justify-center items-center w-full px-2">
        <Card>
            <CardHeader>
                <CardTitle>
                    Welcome Back, Patron
                </CardTitle>
                <CardDescription>
                    Connect to get AI-crafted quotes tailored to your mood and genre.
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
                            <main className="flex items-center justify-between">
                                <main className="flex items-center gap-1">
                                    <Checkbox />
                                    <p className="text-xs font-medium text-foreground tracking-tight">Remember me</p>
                                </main>
                                <Button size={"sm"} variant={"link"} asChild>
                                    <Link to={"/send-mail"}>
                                        Forgot Password?
                                    </Link>
                                </Button>
                            </main>
                        </main>

                        <CardFooter className="flex w-full">
                            <Button disabled={form.formState.isSubmitting} variant={"default"} className="w-full">
                                {form.formState.isSubmitting ? <>
                                    <Loader className="mr-2 w-4 h-4 animate-spin" />
                                    Loading...
                                </> : <>
                                    Login
                                </>}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
            <div className="px-8 pb-8">
            <OauthWrapper />
                <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary hover:underline font-medium">
                    Sign up
                </Link> 
                </p>
            </div>
        </Card>
    </div>
  )
}

export default SignIn