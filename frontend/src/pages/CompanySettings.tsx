import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import {ChangeEvent, useEffect, useState} from "react";
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
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Building, Upload} from "lucide-react";


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
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState("");
    const [savingInfo, setSavingInfo] = useState(false);

    const handleSaveCompanyInfo = async () => {
        if (!companyId) {
            toast.error("Firma nicht erkannt. Bitte neu einloggen.");
            return;
        }

        setSavingInfo(true);
        try {
            const token = await checkCompanyAuth();
            if (!token) {
                navigate("/");
                return;
            }

            const res = await fetch(`http://localhost:5000/api/company/info/${companyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_info: companyInfo
                })
            });

            if (res.ok) {
                toast.success("Unternehmensbeschreibung gespeichert.");
            } else {
                const text = await res.text();
                toast.error("Speichern fehlgeschlagen: " + text);
            }
        } catch (err) {
            toast.error("Fehler beim Speichern.");
            console.error(err);
        } finally {
            setSavingInfo(false);
        }
    };

    useEffect(() => {
        if (!companyId) return;
        fetch(`http://localhost:5000/api/media/company-logo/${companyId}`, { method: "HEAD" })
            .then(res => {
                if (res.ok) setLogoUrl(`http://localhost:5000/api/media/company-logo/${companyId}?t=${Date.now()}`);
                else setLogoUrl(null);
            })
            .catch(() => setLogoUrl(null));
    }, [companyId]);


    async function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
        if (!companyId) {
            toast.error("Firma nicht erkannt. Bitte neu einloggen.");
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Nur JPG, PNG oder SVG erlaubt.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            const res = await fetch(`http://localhost:5000/api/media/company-logo/${companyId}`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Logo erfolgreich hochgeladen.");
                setLogoUrl(`http://localhost:5000/api/media/company-logo/${companyId}?t=${Date.now()}`);
            } else {
                const err = await res.text();
                toast.error("Upload fehlgeschlagen: " + err);
            }
        } catch (error) {
            toast.error("Fehler beim Hochladen");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleLogoDelete() {
        if (!companyId) {
            return toast.error("Firma nicht erkannt");
        }
        setUploading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/media/company-logo/${companyId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Logo entfernt");
                setLogoUrl(null);
            } else {
                const text = await res.text();
                toast.error("Löschen fehlgeschlagen: " + text);
            }
        } catch {
            toast.error("Fehler beim Löschen");
        } finally {
            setUploading(false);
        }
    }

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

                        <div>
                            <h1 className="heading-md text-left pt-5">Firmenlogo</h1>
                            <p className="text-muted-foreground text-left">
                                Verwalten Sie ihr Firmenlogo
                            </p>
                        </div>
                        <Card className="max-w-md">
                            <CardHeader>
                            </CardHeader>
                            <CardContent className="space-y-4 flex flex-col items-center">
                                <div className="h-32 w-32 rounded-md border border-dashed border-muted-foreground/50 flex items-center justify-center mb-4 overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Firmenlogo" className="h-full w-full object-contain" />
                                    ) : (
                                        <Building className="text-muted-foreground/70 text-6xl select-none"/>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Laden Sie ein Logo im JPG, PNG oder SVG Format hoch. Empfohlene Größe: 400x400 Pixel.
                                </p>
                                <label
                                    htmlFor="logo-upload"
                                    className="cursor-pointer inline-flex items-center justify-center p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                                >
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <Upload/>
                                    </svg>
                                    <span className="text-sm">{uploading ? "Lädt..." : "Logo hochladen"}</span>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                {logoUrl && (
                                    <Button
                                        variant="ghost"
                                        className="text-destructive mt-2 h-auto p-1 text-xs"
                                        onClick={handleLogoDelete}
                                        disabled={uploading}
                                    >
                                        Logo entfernen
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                        <div className="mt-12 space-y-2 max-w-xl">
                            <h1 className="heading-md text-left">Unternehmensbeschreibung</h1>
                            <p className="text-muted-foreground text-left">
                                Beschreiben Sie kurz Ihr Unternehmen
                            </p>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-[120px]"
                                placeholder="IT-Firma mit Fokus auf Webentwicklung und Cloud-Lösungen..."
                                value={companyInfo}
                                onChange={(e) => setCompanyInfo(e.target.value)}
                            />
                            <div>
                                <Button onClick={handleSaveCompanyInfo} disabled={savingInfo}>
                                    {savingInfo ? "Speichern..." : "Beschreibung speichern"}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-12 gap-1">
                            <div>
                                <h1 className="heading-md text-left">Passwort ändern</h1>
                                <p className="text-muted-foreground text-left">
                                    Ändern Sie ihr derzeitiges Passwort
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