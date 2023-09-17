import { useState } from 'react'
import '../css/login.css'
import {Link, useNavigate} from 'react-router-dom'
import { Drawer, Alert, Collapse } from '@mui/material';
import SuccesIcon from '../assets/checked.png';
import {ClipLoader} from 'react-spinners';
import axios from 'axios';
import { API_URL } from '../config';
import {  useDispatch } from 'react-redux';
import { savedata } from '../store/user';

export default function Login(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false);
    const [activity, setActivity] = useState(false)
    // const [error2, setError2] = useState(false);


    async function handleRequest(username, password){
            await axios.post(API_URL, {
                query:`
                    {
                       login(loginInput:{
                        phoneNumber:"${username}",
                        password:"${password}"
                        }){
                        access_token,
                        user{
                            id, 
                            email,
                            username,
                            phoneNumber,
                            acctBalance,
                            txPin
                        }
                    }
                    }
                `
            }).then((res)=>{
                if(res.data.data){
                   dispatch(savedata(res.data.data.login))
                   navigate(`/${res.data.data.login.user.username}`)
                }else{
                    setError(true)
                }

            }).finally(()=>{
                setActivity(false)
            })
    }

    return <main className='login actual-login'>
    <Drawer PaperProps={{style:{height:'12%'}}} anchor='bottom' open={success} onClose={()=>{
                setSuccess(false);
                navigate('/');
            }}>
                <div className='signup-success'>
                    <img  src={SuccesIcon} height={50} width={50} alt='succes icon'/>
                    <p> 
                        You have have Signed Up successfully!
                    </p>
                </div>
            </Drawer>
        {error && <Collapse in={error}><Alert title='Sign up Error' severity="error"  onClose={()=>{setError(false)}}>
                Login Error - wrong login details.
        </Alert>
        </Collapse> }
        <div className='header'>
          
            <h1 className='login-header-company'>Veegil media</h1>
            <h3 className='title'>Welcome to Demo bank</h3>
        </div>
        <div className='form-container'>
            <div className='input-container'>
                <input 
                name='phone number' 
                type='number' 
                placeholder='Phone Number'  
                value={username} 
                onChange={(e)=>(setUsername(e.target.value))}
                />
                <input 
                name='password' 
                type='password' 
                placeholder='Password' 
                height={47} 
                value={password} 
                onChange={(e)=>(setPassword(e.target.value))}
                />

            </div>
            <div className='button-container'>
               
                <button onClick={()=>{
                    if(username.length && password.length){
                        
                        setActivity(true)
                        handleRequest(username, password)
                    }
                }}>Login <ClipLoader loading={activity} color='#f4f2ff' size={15} cssOverride={{marginLeft: 8}}/></button>
                <Link to={'/signup'}>
                    <button>SignUp </button>
                </Link>
            </div>
        </div>
        <h4 className='madeby'>MADE BY OSEZELE ANUBAHIMENDO JOSEPH</h4>
        
    </main>
}