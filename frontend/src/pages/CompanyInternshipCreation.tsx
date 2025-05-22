import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";

const CompanyInternshipCreation = () => {
    const [description, setDescription] = useState('');

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
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <div className="relative flex-1">
                                    <ReactQuill
                                        value={description}
                                        onChange={setDescription}
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