import React, { useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useQuery } from 'react-query';

const Home = () => {
    const [show, setShow] = useState(false);
    const allBills = useQuery('allBills', () => fetch('https://polite-whistler-22718.herokuapp.com/api/billing-list').then(res => res.json()))


    if (allBills.isLoading) {
        return <h1 className='text-center'>Loading...</h1>
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = (id) => {
        fetch(`https://polite-whistler-22718.herokuapp.com/api/delete-billing/${id}`, {
            method: "DELETE"
        }).then(res => res.json())
            .then(result => console.log(result))
    }
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Billing ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Paid Amount</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    allBills?.data?.map((bill, i) => <tr key={i}>
                        <td>{bill._id}</td>
                        <td>{bill.name}</td>
                        <td>{bill.email}</td>
                        <td>{bill.phone}</td>
                        <td>{bill.amount}</td>
                        <td><button>Edit</button> <button onClick={handleShow}>Delete</button><Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete a bill</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure want delete bill no: {bill._id}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    No
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(bill._id)}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal></td>
                    </tr>)
                }
            </tbody>
        </Table>
    );
};

export default Home;