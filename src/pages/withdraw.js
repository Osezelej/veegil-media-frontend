import {  useParams, Link, useNavigate } from "react-router-dom";
import '../css/login.css';
import '../css/home.css';
import hamBurger from '../assets/ui.png';
import userIcon from '../assets/user.png';
import DepositIcon from '../assets/save-money.png';
import WithDrawIcon from '../assets/withdrawal.png';
import HomeIcon from '../assets/home.png';
import LogoutIcon from '../assets/logout.png'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Alert } from "@mui/material";
import { Fragment, useState, useCallback, useEffect } from "react";
import BottomDial from "../components/bottomdial";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../config";
import { withdrawAmount } from "../store/user";
import { resetdata } from "../store/user";
import {ClipLoader} from 'react-spinners';


export default function Withdraw(){
    const navigate = useNavigate()
    const {user} = useParams();
    const access_token = useSelector(state=>state.user.access_token)
    const user1 = useSelector(state=>state.user.user);
    const dispatch = useDispatch();
    const [drawer, setDrawer] =useState(false);
    const [amount, setAmount] = useState('');
    const [bottomDrawer, setBottomDrawer] = useState(false);
    const [bottomDail, showBottomDial] = useState(false);
    const [acctno, setAcctno] = useState('')
    const [success, setSuccess]= useState(false)
    const [activity, setActivity]  = useState(false)
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);
    const date = new Date();


    const handleRequest = useCallback(async(amount, acctno)=>{
        let month = date.getMonth()
        let day = date.getDate();
        let year = date.getFullYear();
        let hr = date.getHours()
        let min = date.getMinutes()
        
        await axios.post(API_URL, {
            query:`mutation{
                createTransactions(createTransactionInput:{
                    phoneNumber:"${user1.phoneNumber}",
                    to:"${acctno}",
                    username:"${user1.username}",
                    txType:"debit",
                    txAmount:"${amount}",
                    txDate:"${month}-${day}-${year}"
                    txTime:"${hr}:${min}"
                }){
                    id,
                    txAmount
                }
            }
            `
        }, {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }).then((res)=>{
            console.log('data', res.data)
            if(res.data.data){
                dispatch(withdrawAmount({amount:res.data.data.createTransactions.txAmount})) 
                setSuccess(true)
            }else if (res.data.errors[0].message === 'insufficient balance in your account'){
                setAcctno('')
                setAmount('')
                setError(true)
            }else if(res.data.errors[0].message ==='Forbidden'){
                setAcctno('')
                setError2(true)
            }
            else{
                dispatch(resetdata())
                navigate('/')
            }
        }).catch((e)=>{
            console.log('error', e)
            dispatch(resetdata())
            navigate('/')
        }).finally(()=>{
            setActivity(false)
        })
      
// eslint-disable-next-line
    }, [])

    useEffect(()=>{
        setTimeout(()=>{
            
        }, 1500)
// eslint-disable-next-line
    }, [success, error])


    return <main className="login" >
        <Fragment>
        <BottomDial
            bottomDial = {bottomDail}
            showBottomDial = {showBottomDial}
            txPin= {user1.txPin}
            validateUser={()=>{
                setActivity(true)
                handleRequest(amount.trim(), acctno.trim())
                setAmount('')
                setAcctno('')
            }}
            amount={user1.acctBalance}
        />
        <Drawer open ={bottomDrawer} onClose={()=>{bottomDrawer ? setBottomDrawer(false): setBottomDrawer(true)}} anchor='bottom' PaperProps={{
            style:{
                width: '100%',
                
            }
        }}>
            <List>
                <ListItem disablePadding >
                    <ListItemButton>
                        <ListItemIcon>
                            <img alt="home icon" src={HomeIcon} width={20} height={20}/>
                        </ListItemIcon>
                        <ListItemText primary={user1.username}/>
                    </ListItemButton>
                </ListItem>
                    <ListItem disablePadding >
                        <ListItemButton>
                            <ListItemIcon>
                                <img alt="deposit icon" src={DepositIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={user1.phoneNumber}/>
                        </ListItemButton>
                    </ListItem>
                <ListItem disablePadding >
                        <ListItemButton >
                            <ListItemIcon>
                                <img alt="withDraw icon" src={WithDrawIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={'+234'+ user1.phoneNumber}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding >
                        <ListItemButton >
                            <ListItemIcon>
                                <img alt="logout icon" src={LogoutIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={user1.email}/>
                        </ListItemButton>
                    </ListItem>
            </List>
        </Drawer>
        <Drawer PaperProps={{style:{
            width:'70%'
        }}} open={drawer} onClose={()=>{
            drawer ? setDrawer(false) : setDrawer(true)
        }}>
                <br/>
                <br/>
            <List>
                <Link to={{pathname:`/${user}`}}>
                        <ListItem disablePadding >
                            <ListItemButton>
                                <ListItemIcon>
                                    <img alt="home icon" src={HomeIcon} width={20} height={20}/>
                                </ListItemIcon>
                                <ListItemText primary={'Home'}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                <Link to={{pathname:`/deposit/${user}`}}>
                    <ListItem disablePadding >
                        <ListItemButton>
                            <ListItemIcon>
                            <img alt="deposit icon" src={DepositIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={'Deposit'}/>
                        </ListItemButton>
                    </ListItem>
                </Link>
               <Link to={{pathname:`/withdraw/${user}`}}>
                <ListItem disablePadding >
                        <ListItemButton >
                            <ListItemIcon>
                                <img alt="withDraw icon" src={WithDrawIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={'Transfer'}/>
                        </ListItemButton>
                    </ListItem>
                </Link>
                <ListItem disablePadding  onClick={()=>{
                        dispatch(resetdata())
                        navigate('/')
                    }}>
                        <ListItemButton >
                            <ListItemIcon>
                                <img alt="logout icon" src={LogoutIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={'Logout'}/>
                        </ListItemButton>
                    </ListItem>
                
            </List>
        </Drawer>
        </Fragment>
        
        <nav className="navigation-header">
            <div className="hamburger-menu" onClick={()=>{
                console.log('menu clicked')
                setDrawer(true)
            }}>
                <img alt="hamburger icon" src={hamBurger} height={25} width={25}/>
            </div>
            <div>
                <h4>Transfer</h4>
            </div>
            <div className="user-icon" onClick={()=>{
                setBottomDrawer(true)
            }}>
                <img alt="usericon" src={userIcon} height={25} width={25}/>
                <p className="username">{user}</p>
            </div>
        </nav>
        <div className="bal-display-container">
            <h4 className="currBal">current balance</h4>
            <h2>${user1.acctBalance}</h2>
        </div>
        {success && <Alert onClose={()=>{setSuccess(false)}}>
                SUCCESSFUL! - money was deposited successfully!
            </Alert>}
            {error && <Alert severity="error" onClose={()=>{setError(false)}}>
                    INSUFFICIENT BALANCE - you dont have enough money to complete this transaction!
            </Alert>}
            {error2 && <Alert severity="error" onClose={()=>{setError2(false)}}>
                    WRONG ACCOUNT - The account number you entered is incorrect
            </Alert>}
        <div className="deposit-form-container">
              
                <div className="input-container">
                <input 
                    name='amount' 
                    type='number' 
                    placeholder='Amount'  
                    value={amount} 
                    onChange={(e)=>(setAmount(e.target.value))}
                    /><input 
                    name='account number' 
                    type='number' 
                    placeholder='recipient Account Number'  
                    value={acctno} 
                    onChange={(e)=>(setAcctno(e.target.value))}
                    />
                <select placeholder="Select bank" name="bank">
                    <option value="VG demobank">VG demobank</option>
                </select>

                
                </div>
                <div className="button-container">
                    <button onClick={()=>{
                        if(amount.length > 0 && !isNaN(amount) && !amount.includes('e') && acctno.length > 0 && !isNaN(acctno) && !acctno.includes('e') ){
                            showBottomDial(true)

                        }}}>Withdraw <ClipLoader loading={activity} color='#f4f2ff' size={15} cssOverride={{marginLeft: 8}}/></button>
                </div>

        </div>
    </main>
}
