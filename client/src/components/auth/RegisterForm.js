import {Button, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import AlertMessage from '../layout/AlertMessage'

function RegisterForm() {
     	// Context
	const { registerUser } = useContext(AuthContext)

   
    //Local state
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const { username, password, confirmPassword} = registerForm
    const onChangeRegisterForm = ((e) => {
        setRegisterForm({...registerForm, [e.target.name] : e.target.value})
        //computed property
    })

    const [alert, setAlert] = useState(null)
    const register = async event => {
        event.preventDefault()
        if(password !== confirmPassword){
            setAlert({type: 'danger', message: 'Passwords do not match'})
            setTimeout(() => setAlert(null), 5000)
            return
        }
        try {
            const registerData = await registerUser(registerForm)
            if(!registerData.success) {
                setAlert({type:'danger', message: registerData.message})
                setTimeout(() => setAlert(null), 5000)
            }
            
        } catch (error) {
            console.log(error);
        } 
    }
    return ( 
        <>
            <Form className='my-4' onSubmit={register}>
            <AlertMessage info={alert} />
                <Form.Group className='my-4'>
                    <Form.Control 
                        type="text" 
                        placeholder='Username' 
                        name="username" 
                        required 
                        value={username}
						onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Form.Group className='my-4'>
                    <Form.Control 
                        type="password" 
                        placeholder='Password' 
                        name="password" 
                        required 
                        value={password}
						onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Form.Group className='my-4'>
                    <Form.Control
                        type="password" 
                        placeholder='Confirm Password' 
                        name="confirmPassword" 
                        required 
                        value={confirmPassword}
						onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Button variant="success" type="submit">Register</Button>
            </Form>
            <p>Already have an account
                <Link className='mx-2' to='/login'>
                    <Button variant="info" size="sm" className='ml-2'>Login</Button>
                </Link>
            </p>
        </>
     );
}

export default RegisterForm;


// import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form'
// import { Link } from 'react-router-dom'
// import { useContext, useState } from 'react'
// import { AuthContext } from '../../contexts/AuthContext'
// import AlertMessage from '../layout/AlertMessage'

// const RegisterForm = () => {
// 	// Context
// 	const { registerUser } = useContext(AuthContext)

// 	// Local state
// 	const [registerForm, setRegisterForm] = useState({
// 		username: '',
// 		password: '',
// 		confirmPassword: ''
// 	})

// 	const [alert, setAlert] = useState(null)

// 	const { username, password, confirmPassword } = registerForm

// 	const onChangeRegisterForm = event =>
// 		setRegisterForm({
// 			...registerForm,
// 			[event.target.name]: event.target.value
// 		})

// 	const register = async event => {
// 		event.preventDefault()

// 		if (password !== confirmPassword) {
// 			setAlert({ type: 'danger', message: 'Passwords do not match' })
// 			setTimeout(() => setAlert(null), 5000)
// 			return
// 		}

// 		try {
// 			const registerData = await registerUser(registerForm)
// 			if (!registerData.success) {
// 				setAlert({ type: 'danger', message: registerData.message })
// 				setTimeout(() => setAlert(null), 5000)
// 			}
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	return (
// 		<>
// 			<Form className='my-4' onSubmit={register}>
// 				<AlertMessage info={alert} />

// 				<Form.Group>
// 					<Form.Control
// 						type='text'
// 						placeholder='Username'
// 						name='username'
// 						required
// 						value={username}
// 						onChange={onChangeRegisterForm}
// 					/>
// 				</Form.Group>
// 				<Form.Group>
// 					<Form.Control
// 						type='password'
// 						placeholder='Password'
// 						name='password'
// 						required
// 						value={password}
// 						onChange={onChangeRegisterForm}
// 					/>
// 				</Form.Group>
// 				<Form.Group>
// 					<Form.Control
// 						type='password'
// 						placeholder='Confirm Password'
// 						name='confirmPassword'
// 						required
// 						value={confirmPassword}
// 						onChange={onChangeRegisterForm}
// 					/>
// 				</Form.Group>
// 				<Button variant='success' type='submit'>
// 					Register
// 				</Button>
// 			</Form>
// 			<p>
// 				Already have an account?
// 				<Link to='/login'>
// 					<Button variant='info' size='sm' className='ml-2'>
// 						Login
// 					</Button>
// 				</Link>
// 			</p>
// 		</>
// 	)
// }

// export default RegisterForm