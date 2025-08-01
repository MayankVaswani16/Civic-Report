import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { isLoggedIn } from "@/utils/auth"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { useRegister } from "@/hooks/useAuth"


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

export default function Signup() {
    const navigate = useNavigate()
    const registerMutation = useRegister()
    if (isLoggedIn()) {
        navigate({ to: "/" })
    }
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: FormData) {
        registerMutation.mutate(values, {
            onSuccess: () => {
                toast.success("Account created successfully!")
                navigate({ to: "/login" })
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create account. Please try again.")
            },
        })
    }

    return (
        <main className="min-h-screen bg-background relative flex items-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

            {/* Signup Section */}
            <section className="container mx-auto px-6 py-8 relative z-10 w-full animate-fade-in-up">
                <div className="flex justify-center items-center max-w-md mx-auto">
                    {/* Signup Form */}
                    <div className="w-full">
                        {/* Form Container */}
                        <div className="relative">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-2xl blur-3xl"></div>

                            {/* Main form container with border glow */}
                            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-lg">
                                {/* Header */}
                                <div className="text-center space-y-3 mb-6">
                                    <h4 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
                                        Create your account
                                    </h4>
                                    <p className="text-muted-foreground font-medium tracking-tight">
                                        Join us today and start reporting civic issues
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium tracking-tight">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="John Doe"
                                                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium tracking-tight">Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium tracking-tight">Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Create a strong password"
                                                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium tracking-tight">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm your password"
                                                            className="bg-background border-border text-foreground placeholder:text-muted-foreground h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-tight h-11 mt-6"
                                            size="lg"
                                            disabled={registerMutation.isPending}
                                        >
                                            {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                                        </Button>
                                    </form>
                                </Form>

                                {/* Login Link */}
                                <div className="mt-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-muted-foreground font-medium tracking-tight">
                                            Already have an account?
                                        </span>
                                        <Button
                                            variant="link"
                                            asChild
                                            className="p-0 h-auto text-primary hover:text-primary/80 font-medium tracking-tight"
                                        >
                                            <Link to="/login">Sign in here</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
