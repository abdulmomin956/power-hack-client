import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import axios from '../api/axios';

const Registration = () => {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(user, pass);
        try {
            const response = await axios.post('/api/register',
                JSON.stringify({ user, pass }),
                {
                    headers: { "Content-Type": "application/json" }
                }
            )
            console.log(response);
        }
        catch (err) {
            console.log(err);
        }

    }

    return (
        <section className='container my-5'>
            <header className='text-center'>
                <h1>Create an account</h1>
            </header>
            <Form onSubmit={handleSubmit} className='mx-auto' style={{ width: '500px' }} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" autoComplete='off' onChange={(e) => setUser(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </section>
    );
};

export default Registration;