import React from 'react';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';

const Registration = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
    }
    return (
        <section className='container my-5'>
            <header className='text-center'>
                <h1>Create an account</h1>
            </header>
            <Form onSubmit={handleSubmit} className='mx-auto' style={{ width: '500px' }} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" autoComplete='off' />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </section>
    );
};

export default Registration;