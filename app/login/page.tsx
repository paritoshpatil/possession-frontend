"use client"
import {login, revalidate, signInWithGithub, signup} from './actions'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {LucideGithub} from "lucide-react";
import {userStore} from "@/lib/userStore";
import {redirect, useRouter} from "next/navigation";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email").min(5).max(50),
    password: z.string().min(8),
})

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const router = useRouter()

    const {setUser, setIsLoggedIn} = userStore((state: any) => state)


    async function onSubmit(action: 'login' | 'signup' | 'github', values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        if(action == 'login') {
            let response = await login(values.email, values.password)
            if(response.success) {
                setIsLoggedIn(true)
                setUser(response.data.user)
                await revalidate()
                router.push('/')
            }
            else {
                redirect('/error')
            }
        }
        else if(action == 'signup') {
            signup(values.email, values.password)
        }
        else if(action == 'github') {
            signInWithGithub()
        }
        else return;
    }

    return (
        <main className='w-screen h-screen items-main bg-muted/40 flex justify-center'>
                <Form {...form}>
                    <form className="w-1/3 my-20" onSubmit={form.handleSubmit((values) => onSubmit('login', values))}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-8">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe123" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mb-8">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your password to access possession.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row space-x-4 mb-4">
                            <Button className="w-1/2" type="submit">Sign-in</Button>
                            <Button className="w-1/2"
                                    onClick={() => onSubmit('signup', form.getValues())}>Sign-up</Button>
                        </div>

                        <Button className="w-full"
                                onClick={() => onSubmit('github', form.getValues())}>Sign-in with GitHub
                            <LucideGithub className="ml-2 h-4 w-4" />
                        </Button>

                    </form>
                </Form>
        </main>
    )
}