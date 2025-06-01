import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import {useState} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {checkCompanyAuth} from "@/lib/authUtils.ts";
import {useNavigate} from "react-router-dom";
import {toast, Toaster} from "sonner";

const formSchema = z.object({
    oldPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
    newPassword: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "Das Passwort muss mindestens 8 Zeichen lang sein, " +
        "mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten."
    ),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"]
});

const CompanySettings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const token = await checkCompanyAuth();
        if(!token){
            navigate("/");
            return;
        }
        setIsLoading(true);


        try {
            const response = await fetch("http://localhost:5000/api/company/reset-password", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldpassword: values.oldPassword,
                    newpassword: values.newPassword
                })
            });

            if (response.ok) {
                toast.success("Passwort wurde erfolgreich geändert.");
                form.reset();
            } else if (response.status === 401) {
                toast.error("Aktuelles Passwort ist falsch.");
            } else {
                toast.error("Fehler beim Ändern des Passworts.");
            }

        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster richColors position="top-center" closeButton/>
            <CompanyDashboardSidebar/>
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-6">
                    <FadeIn>
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="heading-md text-left">Konto-Einstellungen</h1>
                                <p className="text-muted-foreground text-left">
                                    Verwalten Sie Ihre Kontoeinstellungen und Passwort
                                </p>
                            </div>

                            <div className="bg-card rounded-lg p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4">Passwort ändern</h2>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="oldPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Aktuelles Passwort</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Aktuelles Passwort eingeben"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Neues Passwort</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Neues Passwort eingeben"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Neues Passwort bestätigen</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Neues Passwort wiederholen"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="pt-2">
                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? "Wird verarbeitet..." : "Passwort ändern"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </FadeIn>
                </main>
            </div>
        </div>
    );
};

export default CompanySettings;