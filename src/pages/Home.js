import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {

    const [nonprofits, setNonprofits] = useState([]);

    useEffect(() => {
        loadNonprofits();
    }, []);

    const loadNonprofits= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/nonprofits");
            setNonprofits(result.data);
        } catch(error){
            console.error("Error loading Nonprofits:", error);
        }
    }

    const DeleteNonprofit= async (id)=>{
        await axios.delete(`http://localhost:8080/nonprofits/${id}`);
        loadNonprofits();
    }

  return (<>

    <div className="add-item-btn-container">
        <Link type="button" className="btn btn-outline-info" to="/addnonprofit">
            Add Nonprofit <i className="bi bi-plus"></i>
        </Link>
    </div>
    <div className='container'>
        <h4>Nonprofits</h4>
        <div className='py-4'>
            <table className="table border shadow">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        nonprofits?nonprofits.map((nonprofit, index) =>(
                            <tr>
                            <th scope="row" key={index}>{index+1}</th>
                            <td>{nonprofit.name}</td>
                            <td>{nonprofit.email}</td>
                            <td>{nonprofit.address}</td>
                            <td>
                            <Link type="button" className="btn btn-outline-info btn-sm" to={`/editnonprofit/${nonprofit.id}`}>
                                <i className="bi bi-pen"></i> Edit
                            </Link>

                            <button type="button" className="btn btn-danger btn-sm del-btn" onClick={()=>DeleteNonprofit(nonprofit.id)}>
                                <i className="bi bi-trash-fill"></i>
                            </button>
                            </td>
                            </tr>
                        )):<></>
                    }
    
                </tbody>
            </table>
        </div>
    </div>
  </>)
}
