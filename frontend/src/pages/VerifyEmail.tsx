import {useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        const verify = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/company/verify-email/${token}`, {
                    credentials: "include"
                });
                if(response.ok) {
                    alert("Email verifiziert!");
                    const data = await response.json();
                    localStorage.setItem("companyAccessToken", data.accessToken);
                    navigate('/company/dashboard');
                } else {
                    alert("Verifizierung fehlgeschlagen.");
                    navigate("/")
                }
            } catch (err) {
                console.log(err);
                alert("Verification failed.");
                navigate("/");
            }
        };
        verify();
    }, [token, navigate]);

    return <p>E-Mail wird bestätigt...</p>;
};

export default VerifyEmail;
