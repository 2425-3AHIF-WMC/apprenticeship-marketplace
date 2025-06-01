import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {logoutCompany} from "@/lib/authUtils.ts";

const formSchema = z
    .object({
        newPassword: z.string().regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
            "Mind. 8 Zeichen, Groß-/Kleinbuchstabe, Zahl, Sonderzeichen erforderlich."
        ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwörter stimmen nicht überein",
        path: ["confirmPassword"],
    });

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/company/reset-password/${token}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newpassword: values.newPassword }),
                }
            );

            if (response.ok) {
                toast.success("Passwort erfolgreich zurückgesetzt.");
                form.reset();
                setTimeout(async () => {
                    await logoutCompany();
                    navigate("/login");
                }, 1000);
            } else {
                toast.error("Zurücksetzen fehlgeschlagen.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ein Fehler ist aufgetreten.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Toaster richColors position="top-center" closeButton />
            <div className="bg-card rounded-lg p-6 shadow-sm max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Passwort zurücksetzen</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Neues Passwort</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Neues Passwort eingeben"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Passwort bestätigen</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Passwort erneut eingeben"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Wird verarbeitet..." : "Passwort zurücksetzen"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
