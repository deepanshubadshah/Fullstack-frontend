import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function Emailtemplates() {

    const [emailtemplates, setEmailtemplates] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        loadEmailtemplates();
    }, []);

    const loadEmailtemplates= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/email-templates");
            setEmailtemplates(result.data);
        } catch(error){
            console.error("Error loading email templates:", error);
        }
    }

    const DeleteEmailtemplate= async (id)=>{
        await axios.delete(`http://localhost:8080/email-templates/${id}`);
        loadEmailtemplates();
    }

  return (<>
    <div class="add-item-btn-container">
        <Link type="button" class="btn btn-outline-info" to="/add-email-templates">
            Add Template<i class="bi bi-plus"></i>
        </Link>
    </div>
    <div className='container'>
        <h4>Email Templates</h4>
        <div className='py-3'>
        {
            emailtemplates?emailtemplates.map((emailtemplate, index) =>(
                <div className="container mt-4 col-4 card-templ">
                    <div className="card">
                        <div className="card-header">
                            Template Name
                        </div>
                        <div className="card-body text-left">
                            <h5 className="card-title mb-2">Subject: {emailtemplate.subject}</h5>
                            <p className="card-text">{emailtemplate.content}</p>
                        </div>
                        <div className="card-footer text-muted text-al-rt">
                            <Link type="button" className="btn btn-outline-info btn-sm" to={`/edit-email-templates/${emailtemplate.id}`}>
                                <i className="bi bi-pen"></i>
                            </Link>
                            <button type="button" className="btn btn-danger btn-sm del-btn" onClick={()=>DeleteEmailtemplate(emailtemplate.id)}>
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )):<></>}

        </div>
    </div>
  </>)
}
