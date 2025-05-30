import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/company/verify_email/${token}`, {
                    credentials: "include"
                });
                if(response.ok) {
                    alert("Email verified!");
                    const data = await response.json();
                    localStorage.setItem("companyAccessToken", data.accessToken);
                    navigate('/company/dashboard');
                } else {
                    alert("Verification failed.");
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
