import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Registration = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pass, setPass] = useState('')
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pass));
        setValidMatch(pass === matchPwd);
    }, [pass, matchPwd])

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(user, pass);
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pass);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post('/api/register',
                JSON.stringify({ user, pass }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            )
            console.log(response);
            console.log(response?.data);
            console.log(response?.accessToken);
            // console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPass('');
            setMatchPwd('');
        }
        catch (err) {
            // console.log(err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            }
            else if (err.response?.status === 400) {
                setErrMsg(err.response.data.message)
            } else {
                setErrMsg('Registration Failed')
            }
            errRef?.current?.focus();
        }

    }

    useEffect(() => {
        setErrMsg('')
    }, [pass, user])

    return (
        <>{success ? (
            <section className='container my-5 mx-auto text-center'>
                <h1>Successfully registered!</h1>
                <p>
                    <Link to='/login'>Login</Link>
                </p>
            </section>
        )
            :
            <section style={{ maxWidth: '500px' }} className='container my-5'>
                <header className='text-center'>
                    <h1>Create an account</h1>
                </header>
                <Form onSubmit={handleSubmit} className='mx-auto' style={{ maxWidth: '480px' }} >
                    {
                        errMsg && <Form.Text>
                            <h5 ref={errRef} className='text-danger'>{errMsg}</h5>
                        </Form.Text>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            ref={userRef}
                            type="text"
                            placeholder="Username"
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)} />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pass ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => setPass(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)} />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            required
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)} />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                    </Form.Group>
                    <Button disabled={!validName || !validPwd || !validMatch ? true : false} variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
                <p>Already have an account?<Link to='/login'>Login Here</Link></p>
            </section>}
        </>
    );
};

export default Registration;