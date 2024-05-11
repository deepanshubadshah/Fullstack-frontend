import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddNonprofit() {

    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [nonprofit, setNonprofit]= useState({name:"", email:"", address:""});

    const {name, email, address}= nonprofit

    const onInputChange=(e)=>{
        setNonprofit({ ...nonprofit, [e.target.name]: e.target.value });
    };

    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            if (nonprofit.email !="" && nonprofit.name!=""){
                await axios.post("http://localhost:8080/nonprofits", nonprofit);
                navigate("/");
            }else{
                setErrorMessage('Both name and email are required.');
            }
        } catch (error){
            setErrorMessage('Some error occured while adding a Nonprofit');
            console.error("Error while Adding Nonprofit: ", error);
        }
    }

  return (
    <div className="container">
       <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h4 className="text-center m-4">Add Nonprofit</h4>

                <form onSubmit={(e) => onSubmit(e)} className="text-al-lt">
                    <div className="mb-3 form-group">
                        <label htmlFor="Name" className="form-label">
                            Name
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Nonprofit name"
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
                    <div className="mb-3 form-group">
                        <label htmlFor="Name" className="form-label">
                            Address
                        </label>
                        <input 
                            type={"text"}
                            className="form-control"
                            placeholder="Enter Address"
                            name="address"
                            value={address}
                            onChange={(e)=> onInputChange(e)}
                        />
                    </div>
                    <div className="text-al-rt">
                        <button type="submit" className="btn btn-outline-primary">
                            Create
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/">
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
