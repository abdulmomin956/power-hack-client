import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';



const Login = () => {
    const { setAuth, persist, setPersist } = useAuth();
    // const data = useAuth();
    // console.log(data);
    let navigate = useNavigate();
    let location = useLocation();

    let from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('')

    const [pass, setPass] = useState('')

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])


    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(user, pass);

        try {
            const response = await axios.post('/api/login',
                JSON.stringify({ user, pass }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            )
            // console.log(response);
            const accessToken = response?.data?.accessToken;
            // const roles = response?.data?.roles;
            setAuth({ user, accessToken });
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPass('');
            navigate(from, { replace: true });
        }
        catch (err) {
            // console.log(err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            }
            else if (err.response?.status === 400) {
                setErrMsg('Missing username or password')
            } else {
                setErrMsg('Login failed')
            }
            errRef?.current?.focus();
        }

    }


    useEffect(() => {
        setErrMsg('')
    }, [pass, user])

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    return (
        <>{success ? (
            <section className='container my-5 mx-auto text-center'>
                <h1>Successfully Login!</h1>
                <p>
                    Go to <Link to='/'>Homepage</Link>
                </p>
            </section>
        )
            :
            <section className='container my-5'>
                <header className='text-center'>
                    <h1>Please Login</h1>
                </header>
                <Form onSubmit={handleSubmit} className='mx-auto' style={{ width: '500px' }} >
                    {
                        errMsg && <Form.Text>
                            <h5 ref={errRef} className='text-danger'>{errMsg}</h5>
                        </Form.Text>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            ref={userRef}
                            type="text"
                            placeholder="Username"
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            required />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => setPass(e.target.value)} />

                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <div className="persistCheck">
                        <input
                            type="checkbox"
                            id="persist"
                            onChange={togglePersist}
                            checked={persist}
                        />
                        <label htmlFor="persist">Trust This Device</label>
                    </div>
                </Form>
            </section>}
        </>
    );
};

export default Login;