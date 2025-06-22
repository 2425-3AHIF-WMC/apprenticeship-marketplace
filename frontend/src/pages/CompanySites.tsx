import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogClose,
    DialogHeader,
    DialogDescription,
    DialogFooter
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
import { toast } from "sonner";
import {ISite} from "@/utils/interfaces.ts";


const siteSchema = z.object({
    name: z.string().min(1, "Name ist erforderlich"),
    address: z.string().min(3, "Adresse ist erforderlich"),
    city: z.string().min(2, "Ort ist erforderlich"),
    plz: z.coerce.number().min(1000, "PLZ ist erforderlich"), // coerce to number
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [siteToDelete, setSiteToDelete] = useState<ISite | null>(null);

    const form = useForm<SiteForm>({
        resolver: zodResolver(siteSchema),
        defaultValues: { name: "", address: "", city: "", plz: 0 },
    });

    async function fetchSites() {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/company/${companyId}/sites`);
            if (!res.ok) {
                throw new Error("Fehler beim Laden der Standorte");
            }
            const data = await res.json();
            const normalized = data.map((site : any) => ({
                ...site,
                plz: Number(site.plz),
            }));
            setSites(normalized);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (companyId) {
            fetchSites();
        }
    }, [companyId]);

    function openDialog(site?: ISite) {
        if (site) {
            setEditSite(site);
            form.reset({
                ...site,
                plz: Number(site.plz),
            });
        } else {
            setEditSite(null);
            form.reset({ name: "", address: "", city: "", plz: 0 });
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error(`Fehler beim Speichern`);
                return;
            }

            await fetchSites();
            toast.success(editSite ? "Standort aktualisiert" : "Standort hinzugefügt");
            setDialogOpen(false);
        } catch (err) {
            toast.error((err as Error).message);
        }
    }

    async function deleteSiteConfirmed(id: number) {
        try {
            const res = await fetch(`http://localhost:5000/api/company/site/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error("Fehler beim Löschen");
            }
            await fetchSites();
            toast.success("Standort gelöscht");
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setDeleteDialogOpen(false);
            setSiteToDelete(null);
        }
    }

    return (
        <section>
            <h1 className="heading-md text-left">Standorte verwalten</h1>
            <p className="text-muted-foreground text-left mb-4">
                Sie können Standorte hinzufügen, bearbeiten und löschen.
            </p>
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
                                <p>{site.address}, {site.plz} {site.city}</p>
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
                                    onClick={() => {
                                        setSiteToDelete(site);
                                        setDeleteDialogOpen(true);
                                    }}
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
                                            <Input
                                                type="number"
                                                placeholder="PLZ eingeben"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ort</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ort eingeben" {...field} />
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
                                <Button type="submit">
                                    {editSite ? "Speichern" : "Hinzufügen"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="text-center"
                >
                    <DialogHeader>
                        <DialogTitle>Standort löschen</DialogTitle>
                        <DialogDescription>
                            Sind Sie sicher, dass Sie diesen Standort löschen möchten?
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center gap-4">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Abbrechen
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => siteToDelete && deleteSiteConfirmed(siteToDelete.location_id!)}
                        >
                            Löschen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export default CompanySites;
