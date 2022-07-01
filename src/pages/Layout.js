import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, FormControl, Modal, Nav, Navbar } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "../api/axios";

const NAME_REGEX = /^[a-z ,.'-]+$/i;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const AMOUNT_REGEX = /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/;

function MyVerticallyCenteredModal(props) {
    const nameRef = useRef();

    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('')
    const [validNumber, setValidNumber] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [amount, setAmount] = useState(0);
    const [validAmount, setValidAmount] = useState(false);

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        nameRef?.current?.focus();
    }, [])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
        setValidEmail(EMAIL_REGEX.test(email));
        setValidNumber(PHONE_REGEX.test(phone));
        setValidAmount(AMOUNT_REGEX.test(amount))
    }, [email, name, phone, amount])



    //handle function
    const handleAdd = async () => {
        const data = { name, phone, email, amount };
        console.log(data);
        props.onHide();
        try {
            const response = await axios.post('/api/add-billing',
                JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            )
            console.log(response);
            console.log(response?.data);
            // console.log(JSON.stringify(response))
            // setSuccess(true);


            setName('');
            setPhone('');
            setAmount('');
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
            // errRef?.current?.focus();
        }
    }
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a new Bill
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Full name
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            ref={nameRef}
                            type="text"
                            placeholder="full name"
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                            required
                        />
                        <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            No special character is allowed in Name<br />
                        </p>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="name@example.com"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}

                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Use a valid email address<br />
                        </p>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Phone number
                            <FontAwesomeIcon icon={faCheck} className={validNumber ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validNumber || !phone ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="text"
                            autoComplete="off"
                            placeholder="01234567890"
                            autoFocus
                            onChange={(e) => setPhone(e.target.value)}
                            onFocus={() => setPhoneFocus(true)}
                            onBlur={() => setPhoneFocus(false)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Paid amount
                            <FontAwesomeIcon icon={faCheck} className={validAmount ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validAmount || !amount ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="00.00"
                            min='1'
                            max='10000000'
                            autoFocus
                            required
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
                <Button
                    variant="success"
                    disabled={!validName || !validEmail || !validNumber || !validAmount ? true : false}
                    onClick={handleAdd}
                >
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const Layout = () => {
    const [modalShow, setModalShow] = useState(false);
    return (
        <main className="App container mt-4">
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link >Billings</Nav.Link>

                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="mx-auto"
                                aria-label="Search"
                            />
                        </Form>
                        <Button className='ms-auto' variant="outline-success" onClick={() => setModalShow(true)}>Add New Bill</Button>
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </main>
    )
}

export default Layout