import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'; 
import { MultiSelect } from 'react-multi-select-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Grants() {

    const [grants, setGrants] = useState([]);
    const [headings, setHeadings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortingColumn, setSortingColumn] = useState(null);
    const [sortingDirection, setSortingDirection] = useState('asc');
    const [inputSearchQuery, setInputSearchQuery] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);
    const [sortConfig, setSortConfig] = useState(null);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagValues, setTagValues] = useState([]);
    const [grantType, setGrantType] = useState('');
    const [grantTypeOptions, setGrantTypeOptions] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [filterObj, setFilterObj]= useState({tags:[], searchQuery:""});
    const {tags, searchQuery}= filterObj;

    const SORT_ASC = 'asc';
    const SORT_DESC = 'desc';

    useEffect(() => {
        loadGrants();
    }, []);

    // const onInputChange=(e)=>{
    //     setFilterObj({ ...filterObj, [e.target.name]: e.target.value });
    // };

    useEffect(() => {
        let seleTags = selectedTags.map(a => a.value);
        setFilterObj({ ...filterObj, ["tags"]: seleTags });
        setTagValues(seleTags);
        loadGrants(currentPage, sortingColumn, sortingDirection);
    }, [selectedTags]);

    const formatHeading = (heading) => {
        return heading.replace(/([a-z])([A-Z])(?=[^A-Z])/g, '$1 $2').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    useEffect(() => {
        loadGrants(currentPage, sortingColumn, sortingDirection);
    }, [currentPage, sortingColumn, sortingDirection, tagValues, grantType]);

    useEffect(() => {
        if(inputSearchQuery.length >2 || inputSearchQuery.length==0){
            loadGrants(currentPage, sortingColumn, sortingDirection);
        }
    }, [inputSearchQuery]);

    // const handleEdit = (row) => {
    // setEditingRow(row);
    // };

    // const handleUpdate = () => {
    // updateItem(editingRow)
    //     .then(() => {
    //     setEditingRow(null);
    //     })
    //     .catch(error => console.error('Error updating item:', error));
    // };

    const nextPage = () => setCurrentPage(prevPage => prevPage + 1);
    const prevPage = () => setCurrentPage(prevPage => prevPage - 1);

    const handleSort = (heading) => {
        let direction = SORT_ASC;
        if (sortConfig && sortConfig.key === heading && sortConfig.direction === SORT_ASC) {
            direction = SORT_DESC;
        }
        setSortConfig({ key: heading, direction: direction });
        setSortingColumn(heading);
        setSortingDirection(direction);
    };

    const renderSortArrow = (heading) => {
        if (!sortConfig || sortConfig.key !== heading) {
            return null;
        }
        return sortConfig.direction === SORT_ASC ? <BiChevronUp /> : <BiChevronDown />;
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setInputSearchQuery(query);
        setFilterObj({ ...filterObj, [e.target.name]: e.target.value });
    };

    const handleScroll = (e) => {
        const scrollPosition = e.target.scrollLeft;
        setScrollPosition(scrollPosition);
    };

    const scrollLeft = () => {
        const container = document.getElementById('table-container');
        container.scrollTo({
            left: scrollPosition - 400,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        const container = document.getElementById('table-container');
        container.scrollTo({
            left: scrollPosition + 400,
            behavior: 'smooth'
        });
    };

    const preprocessData = (data) => {
        return data.map(item => ({
          ...item,
          durationStart: new Date(item.durationStart).toLocaleDateString(),
          durationEnd: new Date(item.durationEnd).toLocaleDateString(),
          requestedAmount: "$"+item.requestedAmount.toLocaleString(),
          awardedAmount: "$"+item.awardedAmount.toLocaleString()
        }));
      };

    const tagsSelectData = (data) => {
        return data.map(item => ({ label: item, value: item }));
    };

    const loadGrants= async (currentPage, sortingColumn, sortingDirection, filterObj)=>{
        try {
            if(typeof currentPage !== 'undefined'){
                let apiUrl = `http://localhost:8080/grants?pageNumber=${currentPage}`;
        
                if (sortingColumn && sortingDirection) {
                apiUrl += `&sortField=${sortingColumn}&sortOrder=${sortingDirection}`;
                }
                if (tagValues && tagValues.length>0) {
                    apiUrl += `&tagsFilter=${tagValues.join(', ')}`;
                }
                if (inputSearchQuery.length>2 || inputSearchQuery.length==0) {
                    apiUrl += `&searchQueryVal=${inputSearchQuery}`;
                }
                if(grantType !=""){
                    apiUrl += `&grantTyp=${grantType}`;
                }
                
                const result= await axios.get(apiUrl);
                const grantData = result.data.grants;
                setTotalPages(result.data.totalPages);
                setUniqueTags(tagsSelectData(result.data.tagsList));
                setGrantTypeOptions(result.data.grantTypes);
                const processedData = preprocessData(grantData);
                setGrants(processedData);
                const formattedHeadings = Object.keys(grantData[0]).filter(heading => heading !== 'id');
                setHeadings(formattedHeadings);
        }
        } catch(error){
            console.error("Error loading Grants:", error);
        }
    }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(!file){
        setErrorMessage("Please choose a file to upload.");
    }else{
        formData.append('file', file);
        try {
        const response = await fetch('http://localhost:8080/grants/upload', {
            method: 'POST',
            body: formData
        });
        handleClose(); loadGrants(1);
        console.log('CSV File uploaded successfully');
        } catch (error) {
        setErrorMessage("Error uploading file! :(");
        console.error('Error uploading file:', error);
        }
    }
  };

  return (<>
    <div className="add-item-btn-container">
        <Link type="button" className="btn btn-outline-info" onClick={handleShow}>
            Upload CSV <i className="bi bi-upload"></i>
        </Link>
    </div>

    <div className='container'>
        <h4>Grants</h4>

        {uniqueTags.length >0? <div className='container border shadow-sm rounded p-3 mb-2 mt-4'>
            <Form className='row'>
                <Form.Group className="mb-1 col-5">
                    <Form.Control type="text" 
                        placeholder="Search by Nonprofit, Submission Name and Email" 
                        name="searchQuery"
                        value={searchQuery}
                        onChange={(e)=> handleSearch(e)}/>
                </Form.Group>
                <Form.Group className="mb-1 col-4">
                    <div class="row">
                        <div class="col-5">
                            <div class="d-inline-block w-100 filter-label">Filter By Tags:</div>
                        </div>
                        <div class="col-7">
                            <MultiSelect className="d-inline-block w-100"
                                placeholder="Filter By Tags"
                                text="Filter By Tags"
                                options={uniqueTags}
                                value={selectedTags}
                                onChange={setSelectedTags}
                                labelledBy="Filter By Tags"
                            />
                        </div>
                    </div>
                </Form.Group>

                <Form.Group className="mb-1 col-3">
                    <Form.Select class="form-control" 
                        name="grantType"
                        value={grantType}
                        onChange={(e)=> setGrantType(e.target.value)}
                        >
                        <option value={""}>All Grant Types</option>
                        { grantTypeOptions?grantTypeOptions.map(grantTypeOption =>(
                            <option value={grantTypeOption}> {grantTypeOption }</option>)
                        ):null}
                    </Form.Select>
                </Form.Group>
            </Form>
        </div>: null}

        {headings.length>0?<><div className='py-2' id="table-container" style={{ overflowX: 'auto' }} onScroll={handleScroll} >
        <table className="table border shadow table-bordered">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    {headings.map((heading, index) => (
                        <th key={index} onClick={() => handleSort(heading)} style={{ cursor: 'pointer' }}>
                        <OverlayTrigger
                            key={heading}
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${heading}`}>Click to sort by {heading}</Tooltip>}
                        >
                            <div>{formatHeading(heading)} {renderSortArrow(heading)}</div>
                        </OverlayTrigger>
                    </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {grants?grants.map((grant, rowIndex) => (
                        <tr key={rowIndex}>
                        <th scope="row">{((currentPage-1)*10)+rowIndex + 1}</th>
                        {Object.keys(grant).filter(a => a !== 'id').map((key, colIndex) => (
                            <td key={`${rowIndex}-${key}`}>{grant[key]}</td>
                        ))}
                        {/* <td>
                            <button className="btn btn-primary btn-sm" onClick={() => handleEdit(grant)}>Edit</button>
                        </td> */}
                        </tr>
                    )): null}
                </tbody>
            </table>
        </div>

            <div className="scroll-buttons mt-2">
                <button className="scroll-button left btn btn-secondary scr-btn" onClick={scrollLeft}>
                    <i class="bi bi-arrow-left-circle cir-icon"></i>
                </button>
                <button className="scroll-button right btn btn-secondary scr-btn" onClick={scrollRight}>
                    <i class="bi bi-arrow-right-circle cir-icon"></i>
                </button>
            </div>
            <div className="row">
                <Pagination className='lg'>
                    <Pagination.First onClick={()=>setCurrentPage(1)} />
                    <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
                    <Pagination.Item>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={nextPage}  disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={()=>setCurrentPage(totalPages)}/>
                </Pagination>
            </div></>:null}
        
    </div>

    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileSm" className="mb-3">
                <Form.Label>Upload Grants CSV here</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} size="sm" />
            </Form.Group>
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            Upload  <i class="bi bi-cloud-upload"></i>
          </Button>
        </Modal.Footer>
      </Modal>

  </>
  )
}
