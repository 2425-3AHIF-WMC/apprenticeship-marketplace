import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar"
import {cn, mapBackendToInternshipDetailsProps} from "@/utils/utils.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchCompanyProfile } from "@/lib/authUtils.ts";
import html2pdf from 'html2pdf.js';
import { XCircle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {useLocation, useNavigate} from "react-router-dom";
import type { InternshipDetailsUIProps } from "@/utils/interfaces";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const departmentOptions = [
    { id: 1, name: "Informatik" },
    { id: 2, name: "Medientechnik" },
    { id: 3, name: "Elektronik" },
    { id: 4, name: "Medizintechnik" },
];

const salarySchema = z.discriminatedUnion('salaryType', [
    z.object({
        salaryType: z.literal('salary'),
        salary: z.preprocess((val) => {
            if (typeof val === 'number') return Number.isNaN(val) ? undefined : val;
            if (typeof val === 'string') {
                const trimmed = val.trim();
                if (trimmed === '') return undefined;
                const num = Number(trimmed);
                return Number.isNaN(num) ? undefined : num;
            }
            return undefined;
        }, z.number({ required_error: "Gehalt muss > 0 sein" }).positive("Gehalt muss > 0 sein")),
        salaryReason: z.optional(z.string()),
    }),
    z.object({
        salaryType: z.literal('not_specified'),
        salary: z.optional(z.number().nullable()),
        salaryReason: z.string({ required_error: "Begründung benötigt (min. 10 Zeichen)" }).min(10, "Begründung benötigt (min. 10 Zeichen)"),
    }),
]);

const descriptionSchema = z.discriminatedUnion('descriptionType', [
    z.object({
        descriptionType: z.literal('editor'),
        editorContent: z.string({ required_error: "Die Beschreibung muss mindestens 30 Zeichen enthalten" }).min(30, { message: "Die Beschreibung muss mindestens 30 Zeichen enthalten" }),
        pdfFile: z.undefined()
    }),
    z.object({
        descriptionType: z.literal('pdf'),
        editorContent: z.optional(z.string()),
        pdfFile: z.instanceof(File, { message: "Eine PDF-Datei muss hochgeladen werden" })
    })
]);


const formSchema = z
    .object({
        title: z.string().min(1, "Ein Titel muss vorhanden sein"),
        internship_application_link: z.string().min(5, "Ein Bewerbungslink muss vorhanden sein"),
        minYear: z.string().min(1, "Eine Schulstufe muss ausgewählt sein"),
        workType: z.string({ required_error: "Eine Arbeitsart muss ausgewählt sein" }),
        duration: z.string({ required_error: "Eine Dauer muss ausgewählt sein" }),
        departments: z.array(z.number()).min(1, "Mindestens eine Abteilung muss ausgewählt sein"),
        deadline: z.date({ message: "Eine Bewerbungsfrist muss ausgewählt sein" }),
        site: z.string({ required_error: "Bitte wählen Sie einen Standort aus." }),
        salaryType: z.enum(['salary', 'not_specified']),
        salary: z.number().nullable().optional(),
        salaryReason: z.string().optional(),
        descriptionType: z.enum(['editor', 'pdf']),
        pdfFile: z.optional(z.instanceof(File)),
        editorContent: z.string().optional()
    })
    .and(salarySchema)
    .and(descriptionSchema);

const CompanyInternshipCreation = () => {
    const location = useLocation();
    const [workTypes, setWorkTypes] = useState<Array<{ worktype_id: string, name: string, description: string }>>([]);
    const [durations, setDurations] = useState<Array<{ internship_duration_id: number, description: string }>>([]);
    const [sites, setSites] = useState<Array<{ location_id: number, address: string, name: string, company_id: number, plz: number }>>([]);
    const [companyId, setCompanyId] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [internshipId, setInternshipId] = useState<number | null>(location.state?.internshipId || null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogSuccess, setDialogSuccess] = useState<boolean | null>(null); // true = success, false = error
    const [dialogMessage, setDialogMessage] = useState("");
    const [fileInputKey, setFileInputKey] = useState(0);
    const navigate = useNavigate();

    const updating = location.state?.updating || false;
    const [editData, setEditData] = useState<InternshipDetailsUIProps | null>(null);

    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const meResponse = await fetchCompanyProfile();
                setCompanyId(meResponse?.company_id == undefined ? 0 : meResponse?.company_id)

                const workTypesResponse = await fetch('http://localhost:5000/api/worktypes');
                const workTypesData = await workTypesResponse.json();
                setWorkTypes(workTypesData);

                const durationsResponse = await fetch('http://localhost:5000/api/internshipDuration');
                const durationsData = await durationsResponse.json();
                setDurations(durationsData);

                setLoading(false);

            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchSites = async () => {
            if (companyId == 0) {
                return;
            }

            try {
                const sitesResponse = await fetch(`http://localhost:5000/api/company/${companyId}/sites`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (sitesResponse.ok) {
                    const sitesData = await sitesResponse.json();
                    setSites(sitesData);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Standorte:', error);
            }
        };

        fetchSites();
    }, [companyId]);

    useEffect(() => {
        if (updating && internshipId) {
            // Hole die Daten vom Backend
            fetch(`http://localhost:5000/api/internship/${internshipId}`)
                .then(res => res.json())
                .then(data => setEditData(mapBackendToInternshipDetailsProps(data)))
                .catch(() => setEditData(null));
        }
    }, [updating, internshipId]);

    useEffect(() => {
        async function fetchPdfAndSetFile(pdfPath: string) {
            try {
                const response = await fetch(`http://localhost:5000/api/media/${pdfPath}`);
                const blob = await response.blob();
                const file = new File([blob], 'praktikum.pdf', { type: 'application/pdf' });
                form.setValue('pdfFile', file);
            } catch (e) {
                // Fehlerbehandlung, z.B. Datei nicht gefunden
            }
        }

        if (updating && editData && sites.length > 0 && workTypes.length > 0 && durations.length > 0) {
            const mapped = mapInternshipDetailsToFormValues(editData, sites, workTypes, durations);
            form.reset(mapped);
            if (editData.pdf) {
                fetchPdfAndSetFile(editData.pdf);
            }
            if (editData.id) setInternshipId(Number(editData.id));
        }
        // eslint-disable-next-line
    }, [updating, editData, sites, workTypes, durations]);

    const form = useForm<z.infer<typeof formSchema>>
        ({
            resolver: zodResolver(formSchema),
            defaultValues: {
                title: '',
                internship_application_link: '',
                minYear: '',
                departments: [],
                salaryType: 'salary',
                duration: undefined,
                workType: undefined,
                descriptionType: 'pdf'
            }
        });

    if (loading) {
        return null;
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // 1. Internship anlegen (ohne PDF)
            const resp = await fetch('http://localhost:5000/api/internship/change', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clicks: String(1),
                    title: values.title,
                    pdf_path: null,
                    min_year: String(values.minYear),
                    internship_creation_timestamp: new Date().toISOString(),
                    salary: String(values.salary || values.salaryReason),
                    application_end: values.deadline.toISOString().split('T')[0],
                    location_id: String(values.site),
                    worktype_id: String(values.workType),
                    internship_duration_id: String(values.duration),
                    internship_application_link: values.internship_application_link,
                    internship_id: updating && Number.isInteger(Number(editData?.id)) && editData?.id != null ? Number(editData.id) : undefined
                })
            });
            if (!resp.ok && resp.status !== 201) {
                setDialogSuccess(false);
                setDialogMessage('Es ist ein Fehler beim ' + (updating ? 'Aktualisieren' : 'Erstellen') + ' des Praktikums aufgetreten.');
                setDialogOpen(true);
                return;
            }
            // 2. ID aus Response holen
            const text = await resp.text();
            let newInternshipId: number | null = null;
            try {
                newInternshipId = JSON.parse(text).internship_id;
            } catch {
                newInternshipId = Number(text);
            }
            if (!newInternshipId) {
                setDialogSuccess(false);
                setDialogMessage('Es ist ein Fehler beim ' + (updating ? 'Aktualisieren' : 'Erstellen') + ' des Praktikums aufgetreten.');
                setDialogOpen(true);
                return;
            }
            setInternshipId(newInternshipId);
            const departmentsResponse = await fetch(`http://localhost:5000/api/departments/create/${newInternshipId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ departments: values.departments })
            });
            if (!departmentsResponse.ok) {
                setDialogSuccess(false);
                setDialogMessage('Es ist ein Fehler beim ' + (updating ? 'Aktualisieren' : 'Erstellen') + ' des Praktikums aufgetreten.');
                setDialogOpen(true);
                return;
            }
            // 3. PDF upload logic
            let pdfFileToUpload = null;
            if (values.descriptionType === 'pdf' && values.pdfFile) {
                pdfFileToUpload = values.pdfFile;
            } else if (values.descriptionType === 'editor' && values.editorContent) {
                // Render the HTML into a hidden div
                const container = document.getElementById('editor-pdf-content');
                if (container) {
                    container.innerHTML = `<div class=\"ql-editor\">${values.editorContent}</div>`;

                    const qlDiv = container.querySelector('.ql-editor');
                    if (qlDiv) {
                        const opt = {
                            margin: 10,
                            filename: 'editor-content.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        const pdfBlob = await html2pdf().set(opt).from(qlDiv).outputPdf('blob');
                        pdfFileToUpload = new File([pdfBlob], 'editor-content.pdf', { type: 'application/pdf' });
                    } else {
                        console.error("Kein .ql-editor gefunden!");
                    }
                }
            }
            if (pdfFileToUpload) {
                const formData = new FormData();
                formData.append('file', pdfFileToUpload);
                const uploadResp = await fetch(`http://localhost:5000/api/media/upload/${newInternshipId}`, {
                    method: 'POST',
                    body: formData
                });
                if (!uploadResp.ok) {
                    setDialogSuccess(false);
                    setDialogMessage('Es ist ein Fehler beim PDF-Upload aufgetreten.');
                    setDialogOpen(true);
                    return;
                }
            }
            // Erfolgsmeldung
            setDialogSuccess(true);
            setDialogMessage(updating ? 'Praktikum wurde erfolgreich aktualisiert!' : 'Praktikum wurde erfolgreich erstellt!');
            setDialogOpen(true);
            if (!updating) {
                form.reset();
                setFileInputKey(prev => prev + 1);
            }
        } catch (error) {
            setDialogSuccess(false);
            setDialogMessage('Es ist ein Fehler aufgetreten: ' + error);
            setDialogOpen(true);
        }
    }


    const watchSalaryType = form.watch('salaryType');

    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'super' }, { 'script': 'sub' }],
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };

    const formats = [
        'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size',
        'strike', 'script', 'underline',
        'blockquote', 'header', 'indent', 'list', 'align', 'code-block',
        'image', 'video'
    ];
    return (
        <>
            <div id="editor-pdf-content" style={{ visibility: 'hidden', position: 'absolute', left: '-9999px', top: 0 }} />
            <div className="flex min-h-screen">
                <CompanyDashboardSidebar />
                <div className="flex-1 flex justify-center">
                    <main className="w-full p-8 space-y-6 relative">
                        <FadeIn>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h1 className="heading-md text-left">Praktika erstellen/updaten</h1>
                                    <p className="text-muted-foreground text-left">
                                        Erstellen von Praktikas, oder Aktualisieren von bereits erstellten.
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stellenbezeichnung</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="z.B. Frontend-Entwickler Praktikum" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="internship_application_link"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bewerbungslink</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="z.B. https://www.example.com/bewerbung" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="minYear"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Minimale Schulstufe</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Minimale Schulstufe auswählen" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">1. Jahrgang</SelectItem>
                                                            <SelectItem value="2">2. Jahrgang</SelectItem>
                                                            <SelectItem value="3">3. Jahrgang</SelectItem>
                                                            <SelectItem value="4">4. Jahrgang</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="workType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Arbeitstyp</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Arbeitstyp wählen" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {workTypes.map((type) => (
                                                                <SelectItem key={type.worktype_id} value={type.worktype_id.toString()}>
                                                                    {type.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="departments"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Abteilungen</FormLabel>
                                                    <div className="flex flex-col space-y-1">
                                                        {departmentOptions.map((dept) => (
                                                            <FormField
                                                                key={dept.id}
                                                                control={form.control}
                                                                name="departments"
                                                                render={({ field }) => {
                                                                    return (
                                                                        <FormItem
                                                                            key={dept.id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(dept.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        if (checked) {
                                                                                            field.onChange([...(field.value || []), dept.id]);
                                                                                        } else {
                                                                                            field.onChange(field.value?.filter((v) => v !== dept.id));
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal">
                                                                                {dept.name}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    )
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="deadline"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Bewerbungsfrist</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP", { locale: de })
                                                                    ) : (
                                                                        <span>Datum auswählen</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                                className={cn("p-3 pointer-events-auto")}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="salaryType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gehaltsangabe</FormLabel>
                                                    <div className="flex flex-col space-y-6">
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                value={field.value}
                                                                className="flex flex-col space-y-1"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <RadioGroupItem value="salary" id="salary" />
                                                                    <FormLabel htmlFor="salary" className="font-normal">
                                                                        Gehalt angeben
                                                                    </FormLabel>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <RadioGroupItem value="not_specified"
                                                                        id="not_specified" />
                                                                    <FormLabel htmlFor="not_specified"
                                                                        className="font-normal">
                                                                        Keine Angabe
                                                                    </FormLabel>
                                                                </div>
                                                            </RadioGroup>
                                                        </FormControl>

                                                        {watchSalaryType === 'salary' && (
                                                            <FormField
                                                                control={form.control}
                                                                name="salary"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Gehalt in EUR</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number"
                                                                                placeholder="z.B. 800" {...field}
                                                                                onChange={(e) => field.onChange(e.target.valueAsNumber)
                                                                                }
                                                                                value={Number.isNaN(field.value) || field.value === null || field.value === undefined ? "" : field.value} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                        {watchSalaryType === 'not_specified' && (
                                                            <FormField
                                                                control={form.control}
                                                                name="salaryReason"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="flex justify-between"><span>Begründung für keine
                                                                            Gehaltsangabe</span>
                                                                            {watchSalaryType === 'not_specified' && (
                                                                                <div className="flex items-center mt-1">
                                                                                    <TooltipProvider>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger asChild>
                                                                                                <span className="inline-flex items-center justify-center w-5 h-5 text-muted-foreground cursor-pointer text-xs">
                                                                                                    <HelpCircle className="w-4 h-4" />
                                                                                                </span>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent side="top">
                                                                                                Diese Nachricht wird den Schülern angezeigt.
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </TooltipProvider>
                                                                                </div>
                                                                            )}
                                                                            </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="Warum haben Sie kein Gehalt angegeben?" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />



                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Praktikumsdauer</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Praktikumsdauer wählen" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {durations.map((duration) => (
                                                                <SelectItem key={duration.internship_duration_id} value={duration.internship_duration_id.toString()}>
                                                                    {duration.description}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="site"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Standort</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Standort wählen" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {sites.length > 0 ? sites.map((site) => (
                                                                <SelectItem key={site.location_id} value={site.location_id.toString()}>
                                                                    {site.name} | {site.address} - {site.plz}
                                                                </SelectItem>
                                                            ))
                                                                : (
                                                                    <SelectItem key={0} value={"0"} disabled>
                                                                        Kein Standort vorhanden - in den Einstellungen hinzufügen
                                                                    </SelectItem>
                                                                )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="descriptionType"
                                            render={({ field }) => (
                                                <FormItem className="col-span-1 md:col-span-2 w-full">
                                                    <FormLabel>Praktikumsausschreibung</FormLabel>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="pdf" id="pdf" />
                                                            <FormLabel htmlFor="pdf">Eigenes PDF hochladen</FormLabel>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="editor" id="editor" />
                                                            <FormLabel htmlFor="editor">PDF erstellen</FormLabel>
                                                        </div>
                                                    </RadioGroup>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {form.watch('descriptionType') === 'editor' ? (
                                            <FormField
                                                control={form.control}
                                                name="editorContent"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1 md:col-span-2 w-full">
                                                        <FormLabel>Beschreibung</FormLabel>
                                                        <FormControl>
                                                            <div className="w-full">
                                                                <ReactQuill
                                                                    value={field.value}
                                                                    onChange={(content) => { field.onChange(content); }}
                                                                    modules={modules}
                                                                    formats={formats}
                                                                    className="bg-primary-foreground text-black"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name="pdfFile"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>PDF Datei</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                key={fileInputKey}
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                            />
                                                        </FormControl>
                                                        {/* Show current PDF if editing and a PDF exists */}
                                                        {updating && editData?.pdf && (
                                                            <div className="mt-2 text-sm text-muted-foreground text-left">
                                                                Aktuelles PDF: <a href={`http://localhost:5000/api/media/${editData.pdf}`} target="_blank" rel="noopener noreferrer" className="underline">praktikum.pdf</a>
                                                            </div>
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        <div className="col-span-1 md:col-span-2 w-full mt-4 flex justify-center">
                                            <Button type="submit" className="md:w-auto">
                                                Praktikum erstellen
                                            </Button>
                                        </div>

                                    </form>
                                </Form>
                            </div>
                        </FadeIn>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent
                                className="text-center"
                                style={!isMobile ? {
                                    left: 'calc(50% + 128px)',
                                    transform: 'translate(-50%, -50%)',
                                    position: 'fixed'
                                } : undefined}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    {dialogSuccess === true && <CheckCircle className="text-green-500 h-10 w-10" />}
                                    {dialogSuccess === false && <XCircle className="text-red-500 h-10 w-10" />}
                                    <DialogHeader>
                                        <DialogTitle>
                                            {dialogSuccess ? "Erfolg" : "Fehler"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {dialogMessage}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Button onClick={() => {setDialogOpen(false); dialogSuccess ? navigate('/company/internships') : null}} className="mt-4 w-full max-w-xs">
                                        Schließen
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </main>
                </div>
            </div>
        </>
    );
}

export default CompanyInternshipCreation;

// Mapping function: InternshipDetailsUIProps -> form values
function mapInternshipDetailsToFormValues(
    data: InternshipDetailsUIProps,
    sites: Array<{ location_id: number, address: string, name: string, company_id: number, plz: number }>,
    workTypes: Array<{ worktype_id: string, name: string, description: string }>,
    durations: Array<{ internship_duration_id: number, description: string }>
) {
    // Determine salaryType
    let salaryType: 'salary' | 'not_specified' = 'salary';
    let salary: number | undefined = undefined;
    let salaryReason = '';
    const salaryStr = typeof data.salary === 'string'
        ? data.salary.slice(0, -2).trim()
        : data.salary;
    if (salaryStr && !isNaN(Number(salaryStr))) {
        salaryType = 'salary';
        salary = Number(salaryStr);
        salaryReason = '';
    } else {
        salaryType = 'not_specified';
        salaryReason = data.salary;
        salary = undefined;
    }
    const minYearStr = data.min_year !== null && data.min_year !== undefined ? String(data.min_year) : "";
    // Find site by id
    let siteValue = '';
    if (data.location) {
        const foundSite = sites.find(site => String(site.location_id) === String(data.location_id));
        if (foundSite) {
            siteValue = foundSite.location_id.toString();
        }
    }

    // Map workType and duration to their IDs
    let workTypeValue = '';
    if (data.work_type) {
        const foundWorkType = workTypes.find(wt => wt.name === data.work_type);
        if (foundWorkType) workTypeValue = foundWorkType.worktype_id.toString();
    }
    let durationValue = '';
    if (data.duration) {
        const foundDuration = durations.find(d => d.description === data.duration);
        if (foundDuration) durationValue = foundDuration.internship_duration_id.toString();
    }

    return {
        title: data.title || '',
        internship_application_link: data.internship_link || '',
        minYear: data.min_year ? minYearStr.replace(/\D/g, "") : "",
        workType: workTypeValue,
        duration: durationValue,
        departments: Array.isArray(data.category)
            ? data.category.map((cat: string) => {
                const found = departmentOptions.find(opt => opt.name === cat);
                return found ? found.id : undefined;
            }).filter((id): id is number => typeof id === 'number')
            : [],
        deadline: data.application_end ? new Date(data.application_end) : undefined,
        site: siteValue, // Use location_id as string if found by id
        salaryType,
        salary,
        salaryReason,
        descriptionType: "pdf" as const,
        pdfFile: undefined, // will be set after fetching
        editorContent: undefined,
        location_id: data.location_id || ''
    };
}