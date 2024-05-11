import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function ViewEmail() {
    const [email, setEmail] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const {id} = useParams();

    const formatTime = (utcDateTime) => {
        const localDateTime = new Date(utcDateTime);
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true};
        return localDateTime.toLocaleString(undefined, options);
    }

    useEffect(() => {
        loadEmail();
    }, []);

    const loadEmail = async ()=>{
        try{
            const result = await axios.get(`http://localhost:8080/emails/${id}`);
            const formattedTime = formatTime(result.data.sentDateTime);
            const formattedResult = { ...result.data, sentDateTime: formattedTime };
            setEmail(formattedResult);
        } catch(error) {
            setErrorMessage("Email Not found! :( ")
            console.error("Error loading email:", error);
        }
    }

  return (
    <div className='container'>
        {errorMessage!=''?<p>{errorMessage}</p>:
        <div className='py-3 container row'>
        {
            email?<>
                <div className="col-2"></div>
                <div className="mt-4 col-8 card-templ">
                    <div className="card text-al-lt">
                        <div className="card-header">
                            <b>From</b>: { email.foundationEmail}<br/>
                            <b>To</b>: { email.recipientEmail}
                        </div>
                        <div className="card-body text-left">
                            <h5 className="card-title mb-2">Subject: {email.subject}</h5><hr/>
                            <p className="card-text mb-4">{email.message}</p>
                        </div>
                        <div className="card-footer text-muted">
                            {email.sentDateTime}
                        </div>
                    </div>
                </div><div className="col-2"></div></>
            :<></>}

        </div>}
    </div>
  )
}
