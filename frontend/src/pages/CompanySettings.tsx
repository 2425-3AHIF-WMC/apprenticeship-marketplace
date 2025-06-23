import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {checkCompanyAuth, fetchCompanyProfile} from "@/lib/authUtils.ts";
import {useNavigate} from "react-router-dom";
import {toast, Toaster} from "sonner";
import CompanySites from "@/pages/CompanySites.tsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card.tsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {Building, Upload, Globe, Mail, Phone, Lock} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";

// --- Validation Schemas ---
const profileSchema = z.object({
    name: z.string().min(2, {message: "Der Firmenname muss mindestens 2 Zeichen lang sein."}),
    company_number: z.string().min(2, {message: "Die Firmenbuchnummer ist erforderlich."}),
    company_info: z.string().min(20, {message: "Die Beschreibung muss mindestens 20 Zeichen lang sein."}),
    website: z.string().url({message: "Bitte geben Sie eine gültige URL ein."}),
    email: z.string().email({message: "Bitte geben Sie eine gültige E-Mail-Adresse ein."}),
    phone_number: z.string().min(5, {message: "Die Telefonnummer muss mindestens 5 Zeichen lang sein."}),
});

const passwordSchema = z.object({
    oldPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
    newPassword: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten."
    ),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
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
    const [profileLoading, setProfileLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [companyId] = useState(getCompanyIdFromToken());
    const [tabValue, setTabValue] = useState("profile");
    const [companyName, setCompanyName] = useState<string | null>(null);

    // --- Profile Form ---
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            company_number: "",
            company_info: "",
            website: "",
            email: "",
            phone_number: "",
        },
    });

    // --- Password Form ---
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // --- Fetch Company Name for Sidebar ---
    const fetchSidebarCompanyName = async () => {
        const data = await fetchCompanyProfile();
        setCompanyName(data ? data.name : null);
    };

    useEffect(() => {
        fetchSidebarCompanyName();
    }, [companyId]);

    // --- Fetch Company Data ---
    const fetchCompanyData = async () => {
        if (!companyId) return;
        setProfileLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/company/${companyId}`);
            if (res.ok) {
                const data = await res.json();
                profileForm.reset({
                    name: data.name || "",
                    company_number: data.company_number || "",
                    company_info: data.company_info || "",
                    website: data.website || "",
                    email: data.email || "",
                    phone_number: data.phone_number || "",
                });
                setCompanyName(data.name || null);
            }
        } catch {
            toast.error("Fehler beim Laden der Firmendaten.");
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyData();
        // eslint-disable-next-line
    }, [companyId]);

    // --- Fetch Logo ---
    useEffect(() => {
        if (!companyId) return;
        fetch(`http://localhost:5000/api/media/company-logo/${companyId}`, {method: "HEAD"})
            .then(res => {
                if (res.ok) setLogoUrl(`http://localhost:5000/api/media/company-logo/${companyId}?t=${Date.now()}`);
                else setLogoUrl(null);
            })
            .catch(() => setLogoUrl(null));
    }, [companyId]);

    // --- Logo Upload ---
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
                fetchCompanyData();
                fetchSidebarCompanyName();
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

    // --- Logo Delete ---
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
                fetchCompanyData();
                fetchSidebarCompanyName();
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

    // --- Save Profile ---
    const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
        if (!companyId) {
            toast.error("Firma nicht erkannt. Bitte neu einloggen.");
            return;
        }
        setIsLoading(true);
        try {
            const token = await checkCompanyAuth();
            if (!token) {
                navigate("/");
                return;
            }
            const res = await fetch(`http://localhost:5000/api/company/details/${companyId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success("Firmendaten erfolgreich gespeichert.");
                fetchCompanyData();
                fetchSidebarCompanyName();
            } else {
                const text = await res.text();
                toast.error("Speichern fehlgeschlagen: " + text);
            }
        } catch (err) {
            toast.error("Fehler beim Speichern.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Password Change ---
    const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
        const token = await checkCompanyAuth();
        if (!token) {
            navigate("/");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/company/reset-password", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldpassword: values.oldPassword,
                    newpassword: values.newPassword,
                }),
            });
            if (response.ok) {
                toast.success("Passwort wurde erfolgreich geändert.");
                passwordForm.reset();
            } else if (response.status === 401) {
                toast.error("Aktuelles Passwort ist falsch.");
            } else {
                toast.error("Fehler beim Ändern des Passworts.");
            }
        } catch (err) {
            toast.error("Fehler beim Ändern des Passworts.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster richColors position="top-center" closeButton/>
            <CompanyDashboardSidebar companyName={companyName} />
            <div className="flex-1 flex flex-col items-center">
                <main className="w-full p-8 space-y-10">
                    <FadeIn>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-left">Unternehmenseinstellungen</h1>
                            <p className="text-muted-foreground text-left text-lg mt-1">
                                Verwalten Sie Ihr Firmenprofil und Ihre Kontoeinstellungen.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={100} >
                        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="profile" className={tabValue === "profile" ? "bg-background text-foreground shadow-sm" : ""}>Firmenprofil</TabsTrigger>
                                <TabsTrigger value="password" className={tabValue === "password" ? "bg-background text-foreground shadow-sm" : ""}>Passwortänderung</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <Card className="md:col-span-2">
                                        <CardHeader className="text-left">
                                            <CardTitle>Profildaten</CardTitle>
                                            <CardDescription>
                                                Aktualisieren Sie die grundlegenden Informationen zu Ihrem Unternehmen.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {profileLoading ? (
                                                <p>Lade Firmendaten...</p>
                                            ) : (
                                                <Form {...profileForm}>
                                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="name"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Unternehmensname</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <div className="absolute left-3 top-3 text-muted-foreground">
                                                                                <Building className="h-4 w-4"/>
                                                                            </div>
                                                                            <Input placeholder="Ihr Unternehmen GmbH" className="pl-10" {...field}/>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="company_number"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Firmenbuchnummer</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="FN 123456a" {...field}/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="company_info"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Unternehmensbeschreibung</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Kurze Beschreibung Ihres Unternehmens..."
                                                                            className="min-h-24"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>
                                                                        Diese Beschreibung wird auf Ihrem Firmenprofil angezeigt.
                                                                    </FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="website"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Website</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <div className="absolute left-3 top-3 text-muted-foreground">
                                                                                <Globe className="h-4 w-4"/>
                                                                            </div>
                                                                            <Input placeholder="https://www.beispiel.com" className="pl-10" {...field}/>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="email"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>E-Mail</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <div className="absolute left-3 top-3 text-muted-foreground">
                                                                                <Mail className="h-4 w-4"/>
                                                                            </div>
                                                                            <Input placeholder="kontakt@beispiel.com" className="pl-10" {...field}/>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="phone_number"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Telefon</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <div className="absolute left-3 top-3 text-muted-foreground">
                                                                                <Phone className="h-4 w-4"/>
                                                                            </div>
                                                                            <Input placeholder="+43 123 456789" className="pl-10" {...field}/>
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="pt-4">
                                                            <Button type="submit" disabled={isLoading}>
                                                                {isLoading ? "Speichern..." : "Änderungen speichern"}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="text-left">
                                            <CardTitle>Firmenlogo</CardTitle>
                                            <CardDescription>
                                                Laden Sie ein Logo für Ihr Unternehmen hoch.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col items-center">
                                                <div className="h-32 w-32 rounded-md border border-dashed border-muted-foreground/50 flex items-center justify-center mb-4 overflow-hidden">
                                                    {logoUrl ? (
                                                        <img
                                                            src={logoUrl}
                                                            alt="Firmenlogo"
                                                            className="h-full w-full object-contain"
                                                        />
                                                    ) : (
                                                        <Building className="h-12 w-12 text-muted-foreground/70"/>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground text-center mb-4">
                                                    Laden Sie ein Logo im JPG, PNG oder SVG Format hoch. Empfohlene Größe: 400x400 Pixel.
                                                </p>
                                                <div className="flex flex-col items-center">
                                                    <label htmlFor="logo-upload" className="cursor-pointer">
                                                        <div className="flex items-center justify-center p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                                                            <Upload className="h-4 w-4 mr-2"/>
                                                            <span className="text-sm">{uploading ? "Lädt..." : "Logo hochladen"}</span>
                                                        </div>
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
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="password">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Passwort ändern</CardTitle>
                                        <CardDescription>
                                            Aktualisieren Sie Ihr Passwort, um die Sicherheit Ihres Kontos zu gewährleisten.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...passwordForm}>
                                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="oldPassword"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Aktuelles Passwort</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                                                        <Lock className="h-4 w-4"/>
                                                                    </div>
                                                                    <Input type="password" className="pl-10" {...field}/>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="newPassword"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Neues Passwort</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                                                        <Lock className="h-4 w-4"/>
                                                                    </div>
                                                                    <Input type="password" className="pl-10" {...field}/>
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Das Passwort sollte mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="confirmPassword"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Neues Passwort bestätigen</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                                                        <Lock className="h-4 w-4"/>
                                                                    </div>
                                                                    <Input type="password" className="pl-10" {...field}/>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="pt-4">
                                                    <Button type="submit" disabled={isLoading}>
                                                        {isLoading ? "Wird verarbeitet..." : "Passwort ändern"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </FadeIn>
                    <FadeIn delay={200}>
                        {companyId ? (
                            <div className="pt-8">
                                <CompanySites companyId={companyId}/>
                            </div>
                        ) : null}
                    </FadeIn>
                </main>
            </div>
        </div>
    );
};

export default CompanySettings;