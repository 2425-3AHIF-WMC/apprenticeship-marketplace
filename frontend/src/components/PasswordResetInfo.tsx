import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordResetInfoProps {
    open: boolean;
    onClose: () => void;
}

const PasswordResetInfo = ({ open, onClose }: PasswordResetInfoProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="text-center">
                <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="text-yellow-500 h-10 w-10" />
                    <DialogHeader>
                        <DialogTitle>Passwort vergessen?</DialogTitle>
                        <DialogDescription>
                            Bitte wende dich an deine Lehrkraft oder den Systemadministrator, um dein Passwort zurücksetzen zu lassen.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={onClose} className="mt-4 w-full max-w-xs">
                        Verstanden
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordResetInfo;
