import axios from 'axios';
import '../css/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import { ClipLoader } from 'react-spinners';
import { Alert, Collapse, Drawer } from '@mui/material';
import SuccesIcon from '../assets/checked.png'

export default function SignUp(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [txPin, setTxPin] = useState('');
    const [activity, setActivity] = useState(false);

    async function handleRequest(username, password, email, txPin, phoneNumber){
        await axios.post(API_URL, {
            query:`mutation{
                signup(createuser:{
                    username:"${username}",
                    password:"${password}",
                    email:"${email}",
                    txPin:"${txPin}",
                    phoneNumber:"${phoneNumber}"
                }){
                    id,
                    phoneNumber
                }
            }`
        }).then((res)=>{
            
            setActivity(false)
            if(res.data.data){
                setSuccess(true)
                setActivity(false)
            }else{
                
                console.log(res.data.data) 
                setError(true)
            }
        })
    }
    const [phoneNo, setPhoneNo] = useState('');
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);
    const [success, setSuccess] = useState(false)
    return <main className='login actual-login'>
            <Drawer PaperProps={{style:{height:'12%'}}} anchor='bottom' open={success} onClose={()=>{
                setSuccess(false);
                navigate('/');
            }}>
                <div className='signup-success'>
                    <img src={SuccesIcon} height={50} width={50} alt='succes icon'/>
                    <p> 
                        You have have Signed Up successfully!
                    </p>
                </div>
            </Drawer>
        {error && <Collapse in={error}><Alert title='Sign up Error' severity="error"  onClose={()=>{setError(false)}}>
                USER ALREADY EXISTS-try another phone number instead.
        </Alert></Collapse> }
        {error2 && <Collapse in={error2}>
            <Alert title='Input Error' severity='warning' onClose={()=>{setError2(false)}}>
            UNFILLED INPUT fIELDS-input right data inside the input fields.
        </Alert>
        </Collapse> }
        <div className='header'>
          
          <h1 className='login-header-company'>Sign Up</h1>
      </div>
      <div className='form-container'>
          <div className='input-container'>
              <input 
              name='username' 
              type='text' 
              placeholder='Username'  
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
              <input 
              name='email' 
              type='email' 
              placeholder='Email' 
              height={47} 
              value={email} 
              onChange={(e)=>(setEmail(e.target.value))}
              />
              <input 
              name='pin' 
              type='text' 
              placeholder='Transaction Pin (number)' 
              height={47} 
              minLength={5}
              maxLength={5}
              value={txPin} 
              onChange={(e)=>(setTxPin(e.target.value))}
              />
              <input 
              name='phoneNumber' 
              type='phone-number' 
              placeholder='Phone Number' 
              height={47} 
              value={phoneNo} 
              onChange={(e)=>(setPhoneNo(e.target.value))}
              />
            
          </div>
          <div className='button-container'>
                  <button onClick={()=>{
                    if(username.length > 0 && phoneNo.length > 0 && email.length > 0 && password.length > 0 && txPin > 0){
                        setActivity(true)
                       handleRequest(username.trim(), password.trim(), email.trim(), txPin.trim(), phoneNo.trim());
                    }else{
                        setError2(true)
                    }
                  }}>SignUp <ClipLoader loading={activity} color='#f4f2ff' size={15} cssOverride={{marginLeft: 8}}/></button>
              
          </div>
      </div>
    </main>
}