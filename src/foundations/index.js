import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Foundations() {

    const [foundations, setFoundations] = useState([]);

    useEffect(() => {
        loadFoundations();
    }, []);

    const loadFoundations= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/foundations");
            setFoundations(result.data);
        } catch(error){
            console.error("Error loading Foundations:", error);
        }
    }

    const DeleteFoundation= async (id)=>{
        await axios.delete(`http://localhost:8080/foundations/${id}`);
        loadFoundations();
    }

  return (<>

    <div class="add-item-btn-container">
        <Link type="button" class="btn btn-outline-info" to="/addfoundation">
            Add Foundation <i class="bi bi-plus"></i>
        </Link>
    </div>
    <div className='container'>
        <h4>Foundations</h4>
        <div className='py-4'>
            <table className="table border shadow">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        foundations?foundations.map((foundation, index) =>(
                            <tr>
                            <th scope="row" key={index}>{index+1}</th>
                            <td>{foundation.name}</td>
                            <td>{foundation.email}</td>
                            <td>
                            <Link type="button" className="btn btn-outline-info btn-sm" to={`/editfoundation/${foundation.id}`}>
                                <i className="bi bi-pen"></i> Edit
                            </Link>

                            <button type="button" className="btn btn-danger btn-sm del-btn" onClick={()=>DeleteFoundation(foundation.id)}>
                                <i className="bi bi-trash-fill"></i>
                            </button>
                            </td>
                            </tr>
                        )): <></>
                    }
    
                </tbody>
            </table>
        </div>
    </div>
  </>)
}
