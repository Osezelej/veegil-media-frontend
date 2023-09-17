/* 
TODO: change the icon of user info bottom drawer
*/
import {  useParams, Link, useNavigate } from "react-router-dom";
import '../css/login.css';
import '../css/home.css';
import '../css/deposit.css'
import hamBurger from '../assets/ui.png';
import userIcon from '../assets/user.png';
import DepositIcon from '../assets/save-money.png';
import WithDrawIcon from '../assets/withdrawal.png';
import HomeIcon from '../assets/home.png';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Alert } from "@mui/material";
import { useState, Fragment, useCallback, useEffect } from "react";
import LogoutIcon from '../assets/logout.png';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../config";
import {ClipLoader} from "react-spinners"
import { depositamount, resetdata } from "../store/user";
import BottomDial from "../components/bottomdial";

export default function Deposit(){
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user1 = useSelector(state=>state.user.user)
    const access_token = useSelector(state=>state.user.access_token)
    const {user} = useParams();
    const [drawer, setDrawer] =useState(false);
    const [amount, setAmount] = useState('');
    const [bottomDrawer, setBottomDrawer] = useState(false);
    const [activity, setActivity] = useState(false);
    const [success, setSuccess] = useState(false)
    const [bottomDail, showBottomDial] = useState(false);
    let date = new Date()
 

    const handleRequest = useCallback(async(amount)=>{
        let month = date.getMonth()
        let day = date.getDate();
        let year = date.getFullYear();
        let hr = date.getHours()
        let min = date.getMinutes()
        
        await axios.post(API_URL, {
            query:`mutation{
                createTransactions(createTransactionInput:{
                    phoneNumber:"${user1.phoneNumber}",
                    to:"${user1.phoneNumber}",
                    username:"${user1.username}",
                    txType:"credit",
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
            console.log('data', res.data.data)
            if(res.data.data){
                dispatch(depositamount({amount:res.data.data.createTransactions.txAmount})) 
                setSuccess(true)
            }else{
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

    const validateuser = useCallback((amount)=>{
        setActivity(true)
        handleRequest(amount.trim())
        setAmount('')

// eslint-disable-next-line
    }, [])
    
    useEffect(()=>{
        setTimeout(()=>{
            
        setSuccess(false);
        }, 1500)
// eslint-disable-next-line
    }, [success])
    return <main className="login">
            
            <Fragment>
                <BottomDial
                    bottomDial={bottomDail}
                    showBottomDial={showBottomDial}
                    txPin={user1.txPin}
                    validateUser={validateuser}
                    amount={amount}
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
                                <img alt="withdraw icon" src={WithDrawIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={`+234${user1.phoneNumber}`}/>
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
                                <img alt="withdraw icon" src={WithDrawIcon} width={20} height={20}/>
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
                    <h4>Deposit</h4>
                </div>
                <div className="user-icon" onClick={()=>{
                    console.log('user icon clicked')
                    setBottomDrawer(true)
                }}>
                    <img alt="user icon" src={userIcon} height={25} width={25}/>
                    <p className="username">{user}</p>
                </div>
            </nav>
            {success && <Alert onClose={()=>{setSuccess(false)}}>
                SUCCESSFUL! - money was deposited successfully!
            </Alert>}
            <div className="deposit-container">
                <div className="bank-name-container">
                    <p className="bank-title">BANK NAME</p>
                    <p className="bank-name">VG BANK</p>
                </div>
                <div className="bank-name-container">
                    <p className="bank-title">ACCOUNT NUMBER</p>
                    <p className ="bank-name">{user1.phoneNumber}</p>
                </div>
                <div className="bank-name-container">
                    <p className="bank-title">ACCOUNT NANE</p>
                    <p className="bank-name">{user1.username}</p>
                </div>
            </div>
            <div className="deposit-form-container">
                <div className="input-container">
                    <input 
                    name='amount' 
                    type='number' 
                    placeholder='Amount'  
                    value={amount} 
                    onChange={(e)=>(setAmount(e.target.value))}
                    />
                </div>
                <div className="button-container">
                    <button onClick={()=>{
                        if(amount.length > 0 && !isNaN(amount) && !amount.includes('e')){
                            showBottomDial(true)

                        }
                    }}>Deposit <ClipLoader loading={activity} color='#f4f2ff' size={15} cssOverride={{marginLeft: 8}}/></button>
                </div>
            </div>
    </main>
}