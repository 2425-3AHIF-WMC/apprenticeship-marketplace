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
import CompanySites from "@/pages/CompanySites.tsx";

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

function getCompanyIdFromToken(): number | null {
    try {
        const token = localStorage.getItem("companyAccessToken");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.company_id || null;
    } catch {
        return null;
    }
}

const CompanySettings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const companyId = getCompanyIdFromToken();


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
                        {companyId ? (
                            <CompanySites companyId={companyId}/>
                        ) : (
                            <p>Firma nicht erkannt. Bitte neu einloggen.</p>
                        )}


                        <div className="flex flex-col mt-12 gap-1">
                            <div>
                                <h1 className="heading-md text-left">Passwort zurücksetzen</h1>
                                <p className="text-muted-foreground text-left">
                                    Setzen Sie ihr derzeitiges Passwort zurück
                                </p>
                            </div>

                            <div className="bg-card rounded-lg p-6 shadow-sm">
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