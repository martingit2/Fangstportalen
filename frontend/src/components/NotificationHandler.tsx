import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const NotificationHandler: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const verificationStatus = searchParams.get('verification');

        if (verificationStatus === 'success') {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('verification');
            newParams.delete('support_code'); 
            newParams.delete('state');
            setSearchParams(newParams, { replace: true });

            navigate('/registrering/vellykket', {
                replace: true,
                state: {
                    title: "E-post verifisert!",
                    message: "Din konto er nå aktivert. Du kan nå logge inn for å fortsette.",
                    icon: 'success'
                }
            });
            return; 
        }
        
        if (error === 'access_denied' && errorDescription) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('error');
            newParams.delete('error_description');
            newParams.delete('state');
            setSearchParams(newParams, { replace: true });

            if (errorDescription.includes("Vennligst bekreft")) {
                 navigate('/registrering/verifiser-epost', {
                    replace: true,
                    state: {
                        title: "Registrering nesten fullført!",
                        message: "En verifiseringslenke er sendt til din e-post. Vennligst sjekk innboksen og klikk på lenken for å aktivere kontoen din.",
                        icon: 'success'
                    }
                 });
            } else {
                 navigate('/feilmelding', {
                    replace: true,
                    state: {
                        title: "Tilgang Nektet",
                        message: `En feil oppstod: ${errorDescription}`,
                        icon: 'error'
                    }
                 });
            }
        }
    }, [searchParams, setSearchParams, navigate]);

    return null;
};

export default NotificationHandler;