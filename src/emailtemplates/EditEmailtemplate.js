import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditEmailtemplate() {

    let navigate = useNavigate();

    const {id} = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [emailtemplate, setEmailtemplate]= useState({subject:"", content:""});

    const {subject, content}= emailtemplate

    const onInputChange=(e)=>{
        setEmailtemplate({ ...emailtemplate, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadEmailtemplate();
    }, []);

    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            if (emailtemplate.subject !="" && emailtemplate.content!=""){
                await axios.put(`http://localhost:8080/email-templates/${id}`, emailtemplate);
                navigate("/email-templates");
            }else{
                setErrorMessage('Both name and email are required.');
            }
        } catch (error){
            setErrorMessage('Some error occured while editing email template');
            console.error("Error while editing email template: ", error);
        }
    };

    const loadEmailtemplate = async ()=>{
        const result = await axios.get(`http://localhost:8080/email-templates/${id}`);
        setEmailtemplate(result.data);
    }

  return (
    <div className="container">
       <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h4 className="text-center m-4">Edit Template</h4>

                <form className='text-al-lt' onSubmit={(e) => onSubmit(e)}>
                    <div className="mb-3 form-group">
                        <label className="form-label">
                            Subject
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter subject"
                            name="subject"
                            value={subject}
                            onChange={(e)=> onInputChange(e)}
                        />
                        <small id="emailHelp" class="form-text text-muted">(All templates should have unique name)</small>
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
