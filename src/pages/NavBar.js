import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

const NavBar = () => {
    const { auth } = useAuth();
    // const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        // navigate('/linkpage');
    }
    return (
        <Navbar bg='light'>
            <Container>
                <Navbar.Brand as={Link} to='/'>Power Hack</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {
                        auth.accessToken && <Navbar.Text>
                            <Button variant='success' onClick={signOut}>Logout</Button>
                        </Navbar.Text>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;