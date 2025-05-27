import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar"
import {cn} from "@/lib/utils.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {de} from "date-fns/locale";

const formSchema = z.object({
    title: z.string().min(1, "Ein Titel muss vorhanden sein"),
    internshipDescription: z.string().min(5, "Eine kurze Beschreibung muss vorhanden sein"),
    minYear: z.string().min(1, "Eine Schulstufe muss ausgewählt sein"),
    workType: z.string().min(1, "Eine Arbeitsart muss ausgewählt sein"),
    departments: z.array(z.string()).min(1, "Mindestens eine Abteilung muss ausgewählt sein"),
    deadline: z.date({message: "Eine Bewerbungsfrist muss ausgewählt sein"})
});

const CompanyInternshipCreation = () => {
    const [description, setDescription] = useState('');
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    const form = useForm<{
        title: string;
        internshipDescription: string;
        minYear: string;
        workType: string;
        departments: string[];
        deadline: Date;
    }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            internshipDescription: '',
            minYear: '',
            workType: '',
            departments: []
        }
    });
    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            [ 'bold', 'italic', 'underline', 'strike' ],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'super' }, { 'script': 'sub' }],
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
            [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
            [ { 'align': [] }],
            [ 'link', 'image', 'video'],
            [ 'clean' ]
        ]
    };

    const formats = [
        'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size',
        'strike', 'script', 'underline',
        'blockquote', 'header', 'indent', 'list', 'align', 'code-block',
        'image', 'video'
    ];
    return (
        <div className="flex min-h-screen">
            <CompanyDashboardSidebar/>
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-6 ">
                    <FadeIn>
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="heading-md text-left">Praktika erstellen/hinzufügen</h1>
                                <p className="text-muted-foreground text-left">
                                    Erstellen von Praktikas, oder Hinzufügen von bereits erstellten.
                                </p>
                            </div>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stellenbezeichnung</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="z.B. Frontend-Entwickler Praktikum" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="internshipDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Kurzbeschreibung</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="z.B. IT-Entwicklung" {...field} />
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
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                                <SelectItem value="5">5. Jahrgang</SelectItem>
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
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Arbeitstyp wählen" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                                                <SelectItem value="remote">Remote</SelectItem>
                                                                <SelectItem value="onsite">On Site</SelectItem>
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
                                                            {['Informatik', 'Medientechnik', 'Medizintechnik', 'Elektronik'].map((dept) => (
                                                                <FormField
                                                                    key={dept}
                                                                    control={form.control}
                                                                    name="departments"
                                                                    render={({ field }) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={dept}
                                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(dept)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            if (checked) {
                                                                                                field.onChange([...(field.value || []), dept]);
                                                                                            } else {
                                                                                                field.onChange(field.value?.filter((v) => v !== dept));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {dept}
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
                                            <div className="flex justify-end">
                                                <Button type="submit" className="w-full md:w-auto">
                                                    Praktikum erstellen
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>

                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <div className="relative flex-1">
                                    <ReactQuill
                                        value={description}
                                        onChange={setDescription}
                                        modules={modules}
                                        formats={formats}
                                        className="bg-primary-foreground text-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </main>
            </div>
        </div>
    );
}

export default CompanyInternshipCreation;