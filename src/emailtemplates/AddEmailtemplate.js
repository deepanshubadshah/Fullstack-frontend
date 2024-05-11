import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddEmailtemplate() {

    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [emailtemplate, setEmailtemplate]= useState({name:"", subject:"", content:""});

    const {name, subject, content}= emailtemplate

    const onInputChange=(e)=>{
        setEmailtemplate({ ...emailtemplate, [e.target.name]: e.target.value });
    };

    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            if (emailtemplate.content !="" && emailtemplate.subject!="" && emailtemplate.name!=""){
                await axios.post("http://localhost:8080/email-templates", emailtemplate);
                navigate("/email-templates");
            }else{
                setErrorMessage('All field are required.');
            }
        } catch (error){
            setErrorMessage('Some error occured while adding a email template');
            console.error("Error while adding email template: ", error);
        }
    }

  return (
    <div className="container">
       <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h4 className="text-center m-4">Add Template</h4>

                <form className='text-al-lt' onSubmit={(e) => onSubmit(e)}>
                    <div className="mb-3 form-group">
                        <label htmlFor="Name" className="form-label">
                            Template Name
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Template name"
                            name="name"
                            value={name}
                            onChange={(e)=> onInputChange(e)}
                        />
                        <small id="emailHelp" class="form-text text-muted">(All templates should have unique name)</small>
                    </div>
                    
                    <div className="mb-3 form-group">
                        <label htmlFor="Subject" className="form-label">
                            Subject
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Subject"
                            name="subject"
                            value={subject}
                            onChange={(e)=> onInputChange(e)}
                        />
                    </div>
                    <div className="mb-3 form-group">
                        <label className="form-label">Email Content</label>
                        <small id="emailHelp" class="form-text text-muted">{` (use %{name}s and %{address}s as a placeholders)`}</small>
                        <textarea
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Content here"
                            name="content"
                            value={content}
                            onChange={(e)=> onInputChange(e)}
                            id="exampleFormControlTextarea1"
                            rows="4"
                        />
                        <small id="emailHelp" class="form-text text-muted">{` (e.g. Sending money to nonprofit %{name}s at address %{address}s).`}</small>
                
                    </div>
                    <div className="text-al-rt">
                        <button type="submit" className="btn btn-outline-primary">
                            Create
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/email-templates">
                            Cancel
                        </Link>
                    </div>
                </form>
                {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                
            </div>
        </div> 
    </div>
  )
}
