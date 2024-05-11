import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditFoundation() {

    let navigate = useNavigate();
    const {id} = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [foundation, setFoundation]= useState({name:"", email:""});

    const {name, email}= foundation

    const onInputChange=(e)=>{
        setFoundation({ ...foundation, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadFoundation();
    }, []);

    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            if (foundation.email !="" && foundation.name!=""){
                await axios.put(`http://localhost:8080/foundations/${id}`, foundation);
                navigate("/foundations");
            }else{
                setErrorMessage('Both name and email are required.');
            }
        } catch (error){
            setErrorMessage('Some error occured while editing Foundation');
            console.error("Error while editing Foundation: ", error);
        }
    };

    const loadFoundation = async ()=>{
        const result = await axios.get(`http://localhost:8080/foundations/${id}`);
        setFoundation(result.data);
    }

  return (
    <div className="container">
       <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h4 className="text-center m-4">Edit Foundation</h4>

                <form onSubmit={(e) => onSubmit(e)} className="text-al-lt">
                    <div className="mb-3 form-group">
                        <label htmlFor="Name" className="form-label">
                            Name
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Foundation name"
                            name="name"
                            value={name}
                            onChange={(e)=> onInputChange(e)}
                        />
                    </div>
                    <div className="mb-3 form-group">
                        <label htmlFor="Email" className="form-label">
                            Email
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Email"
                            name="email"
                            value={email}
                            onChange={(e)=> onInputChange(e)}
                        />
                    </div>
                    <div className="text-al-rt">
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/foundations">
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
