import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ISite {
    location_id?: number;
    name: string;
    address: string;
    plz: string;
    company_id: number;
}

const siteSchema = z.object({
    name: z.string().min(1, "Name ist erforderlich"),
    address: z.string().min(3, "Adresse ist erforderlich"),
    plz: z.string().min(4, "PLZ ist erforderlich"),
});

type SiteForm = z.infer<typeof siteSchema>;

interface Props {
    companyId: number;
}

function CompanySites({ companyId }: Props) {
    const [sites, setSites] = useState<ISite[]>([]);
    const [loading, setLoading] = useState(false);
    const [editSite, setEditSite] = useState<ISite | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<SiteForm>({
        resolver: zodResolver(siteSchema),
        defaultValues: { name: "", address: "", plz: "" },
    });

    // Sites laden
    async function fetchSites() {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/company/${companyId}/sites`);
            if (!res.ok) throw new Error("Fehler beim Laden der Standorte");
            const data = await res.json();
            setSites(data);
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (companyId) fetchSites();
    }, [companyId]);

    // Öffnet Dialog (Neu oder Bearbeiten)
    function openDialog(site?: ISite) {
        if (site) {
            setEditSite(site);
            form.reset(site);
        } else {
            setEditSite(null);
            form.reset({ name: "", address: "", plz: "" });
        }
        setDialogOpen(true);
    }

    async function onSubmit(data: SiteForm) {
        const payload = {
            ...data,
            company_id: companyId,
            location_id: editSite?.location_id,
        };

        try {
            const res = await fetch("http://localhost:5000/api/company/site", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Fehler beim Speichern");

            await fetchSites();
            setDialogOpen(false);
        } catch (err) {
            alert((err as Error).message);
        }
    }

    async function deleteSite(id: number) {
        if (!confirm("Standort wirklich löschen?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/company/site/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Fehler beim Löschen");
            await fetchSites();
        } catch (err) {
            alert((err as Error).message);
        }
    }

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Standorte verwalten</h2>

            <Button onClick={() => openDialog()} className="mb-4">
                Neuen Standort hinzufügen
            </Button>

            {loading ? (
                <p>Lade Standorte...</p>
            ) : sites.length === 0 ? (
                <p>Keine Standorte vorhanden.</p>
            ) : (
                <ul className="space-y-3">
                    {sites.map((site) => (
                        <li
                            key={site.location_id}
                            className="flex justify-between items-center border p-4 rounded"
                        >
                            <div>
                                <p className="font-semibold">{site.name}</p>
                                <p>
                                    {site.address}, {site.plz}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDialog(site)}
                                >
                                    Bearbeiten
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteSite(site.location_id!)}
                                >
                                    Löschen
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogTitle>
                        {editSite ? "Standort bearbeiten" : "Neuen Standort hinzufügen"}
                    </DialogTitle>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name eingeben" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Adresse eingeben" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="plz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PLZ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="PLZ eingeben" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit">{editSite ? "Speichern" : "Hinzufügen"}</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export default CompanySites;
