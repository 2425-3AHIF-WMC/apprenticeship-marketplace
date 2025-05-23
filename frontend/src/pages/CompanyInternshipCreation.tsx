import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import FadeIn from "@/components/FadeIn.tsx";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";

const CompanyInternshipCreation = () => {
    const [description, setDescription] = useState('');
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
    console.log(description);
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