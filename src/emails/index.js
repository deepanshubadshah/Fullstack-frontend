import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import { Button, Form, Modal } from 'react-bootstrap';

export default function Emails() {
    
    const [foundations, setFoundations] = useState([]);
    const [nonprofits, setNonprofits] = useState([]);
    const [emailtemplates, setEmailtemplates] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [emails, setEmails] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedNonprofits, setSelectedNonprofits] = useState([]);
    const fieldMapping = {email: 'label',id: 'value'};

    const [newEmail, setNewEmail]= useState({foundationEmail:"", emailTemplateId:"", nonprofitIds:[], ccTo:"", bccTo:""});
    const {foundationEmail, emailTemplateId, nonprofitIds, ccTo, bccTo}= newEmail
    
    const onInputChange=(e)=>{
        setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        let nonprofitList = selectedNonprofits.map(a => a.value);
        setNewEmail({ ...newEmail, ["nonprofitIds"]: nonprofitList });
    }, [selectedNonprofits]);

    useEffect(() => {
        loadEmails();
    }, []);

    useEffect(() => {
        if(show){
            loadFoundations();
            loadNonprofits();
            loadEmailtemplates();
        }
    }, [show]);

    const formatTime = (utcDateTime) => {
        const localDateTime = new Date(utcDateTime);
        const options = {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true};
        return localDateTime.toLocaleString(undefined, options);
    }

    const handleEmailClick = (id) => {
        window.location.href = `/emails/${id}`;
    };

    const loadFoundations= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/foundations");
            setFoundations(result.data);
        } catch(error){
            console.error("Error loading Foundations:", error);
        }
    }

    const loadNonprofits= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/nonprofits");

            const selectedData = result.data.map(item =>
                Object.keys(fieldMapping).reduce((acc, key) => ({
                  ...acc,[fieldMapping[key]]: item[key]
                }), {})
              );
            setNonprofits(selectedData);
        } catch(error){
            console.error("Error loading Nonprofits:", error);
        }
    }

    const loadEmailtemplates= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/email-templates");
            setEmailtemplates(result.data);
        } catch(error){
            console.error("Error loading email templates:", error);
        }
    }

    const loadEmails= async ()=>{
        try {
            const result= await axios.get("http://localhost:8080/emails");
            const formattedTime = formatTime(result.data.sentDateTime);
            const formattedResult = { ...result.data, sentDateTime: formattedTime };
            setEmails(result.data);
        } catch(error){
            console.error("Error loading emails:", error);
        }
    }

    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            if (newEmail.foundationEmail !="" && newEmail.emailTemplateId!="" && selectedNonprofits.length>0){
                await axios.post("http://localhost:8080/emails/send-to-nonprofits", newEmail);
                handleClose(); loadEmails();
            }else{
                setErrorMessage('All fields are required.');
            }
        } catch (error){
            setErrorMessage('Some error occured while sending email');
            console.error("Error while sending email: ", error);
        }
    }

  return (<>
    <div className="add-item-btn-container">
        <Link type="button" className="btn btn-outline-info" onClick={handleShow}>
            Compose Mail <i className="bi bi-envelope-plus"></i>
        </Link>
    </div>

    <div className='container'>
        <h4>Sent Emails</h4>
        <div className='py-2'>
        {emails.length >0 ? <div className="container text-al-lt ">
                <ul className="email-list mt-4 mx-2 border rounded p-2 shadow-sm">
                { emails.map((email, index) =>(
                    <li className="email-list-item outer-li px-4" onClick={() => handleEmailClick(email.id)}>
                        <div className="row">
                        <div className="col-md-3">
                            <strong>From:</strong> &lt;{email.foundationEmail}&gt;
                        </div>
                        <div className="col-md-3">
                            <strong>To:</strong> &lt;{email.recipientEmail}&gt;
                        </div>
                        <div className="col-md-4">
                            <strong>Subject:</strong> {email.subject}
                        </div>
                        <div className="col-md-2 text-al-rt font-sm">
                            <strong>{formatTime(email.sentDateTime)}</strong>
                        </div>
                        </div>
                    </li>
                ))}
                </ul>
            </div>: null}
        </div>
    </div>

    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
                <Form.Label >Foundation</Form.Label>
                <Form.Select class="form-control" 
                    name="foundationEmail"
                    value={foundationEmail}
                    onChange={(e)=> onInputChange(e)}
                    >
                    <option value={""}>Select Foundation</option>
                    { foundations?foundations.map(foundation =>(
                        <option value={foundation.email}> {foundation.name } &lt;{foundation.email}&gt;</option>)
                    ):null}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label >Email Template</Form.Label>
                <Form.Select class="form-control" 
                    name="emailTemplateId"
                    type="number"
                    value={emailTemplateId}
                    onChange={(e)=> onInputChange(e)}
                    >
                    <option value={""}>Select Email Template</option>
                    { emailtemplates?emailtemplates.map(emailtemplate =>(
                        <option value={emailtemplate.id}> {emailtemplate.name}</option>)
                    ):null}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Select Nonprofits</Form.Label>
                <MultiSelect
                    options={nonprofits}
                    value={selectedNonprofits}
                    onChange={setSelectedNonprofits}
                    labelledBy="Select"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>CC To</Form.Label>
                <Form.Control type="email" 
                    placeholder="Enter email" 
                    name="ccTo"
                    value={ccTo}
                    onChange={(e)=> onInputChange(e)}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>BCC To</Form.Label>
                <Form.Control type="email" 
                    placeholder="Enter email" 
                    name="bccTo"
                    value={bccTo}
                    onChange={(e)=> onInputChange(e)}/>
            </Form.Group>

            {errorMessage? errorMessage:null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={(e) => onSubmit(e)}>
            Send  <i class="bi bi-send"></i>
          </Button>
        </Modal.Footer>
      </Modal>

  </>)
}