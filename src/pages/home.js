import {  useParams, useNavigate, Link } from "react-router-dom";
import '../css/login.css';
import '../css/home.css';
import hamBurger from '../assets/ui.png';
import userIcon from '../assets/user.png';
import DepositIcon from '../assets/save-money.png';
import WithDrawIcon from '../assets/withdrawal.png';
import TelephoneIcon from '../assets/telephone.png';
import EmailIcon from '../assets/email.png'
import HomeIcon from '../assets/home.png';
import LogoutIcon from '../assets/logout.png';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config";
import { resetdata } from "../store/user";
import {ClipLoader} from "react-spinners";
export default function Home(){
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState([])
    const access_token = useSelector(state=>state.user.access_token)
    const user1 = useSelector(state=>state.user.user);
    const dispatch = useDispatch()
    const {user} = useParams();
    const [drawer, setDrawer] =useState(false);
    const [bottomDrawer, setBottomDrawer] = useState(false);
    const [activity, setActivity] = useState(false)
    let handleRequest = useCallback(async(phoneNumber)=>{
        console.log(phoneNumber)
        console.log(access_token)
        await axios.post(API_URL, {
            query:`
                    {
                    getTransaction(acctno:"${phoneNumber}"){
                        id,
                      acctNo,
                      to,
                      from,
                      txType,
                      txAmount,
                      txDate,
                      txTime  
                }
            }`
        }, {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }).then((res)=>{
            
            console.log(res.data)
            if(res.data.data){
                setTransactions(res.data.data.getTransaction.reverse())
            }else{
                dispatch(resetdata())
                navigate('/')
            }
           
            
        }).catch((e)=>{
            console.log(access_token)
            console.log(e)
            dispatch(resetdata())
            navigate('/')
            
        }).finally(()=>{
            setTimeout(()=>{
                
            setActivity(false)
            }, 2000)
        })

// eslint-disable-next-line
    },[])
    useEffect(()=>{
        handleRequest(user1.phoneNumber)

// eslint-disable-next-line
    }, [])
    useEffect(()=>{
        if(transactions.length !== 0){
            console.log(transactions)
        }
    }, [transactions])
    return <main className="login" >
        <Fragment>
        <Drawer open ={bottomDrawer} onClose={()=>{bottomDrawer ? setBottomDrawer(false): setBottomDrawer(true)}} anchor='bottom' PaperProps={{
            style:{
                width: '100%',
            }
        }}>
            <List>
                <ListItem disablePadding >
                    <ListItemButton>
                        <ListItemIcon>
                            <img alt="home icon" src={userIcon} width={20} height={20}/>
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
                                <img alt="with draw icon" src={TelephoneIcon} width={20} height={20}/>
                            </ListItemIcon>
                            <ListItemText primary={'+234' + user1.phoneNumber}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding >
                        <ListItemButton >
                            <ListItemIcon>
                                <img alt="logouticon" src={EmailIcon} width={20} height={20}/>
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
                <h4>VG Bank</h4>
            </div>
            <div className="user-icon" onClick={()=>{
                console.log('user icon clicked')
                setBottomDrawer('true')
            }}>
                <img alt="user icon" src={userIcon} height={25} width={25}/>
                <p className="username">{user}</p>
            </div>
        </nav>
        <div className="bal-display-container">
            <h4 className="currBal">current balance</h4>
            <h2>${user1.acctBalance}</h2>
        </div>
        <div className="transaction-container">
            <h3>Transaction</h3>
            <div className="list-items">
              {activity ? <ClipLoader loading={activity} color='#f4f2ff' size={15} cssOverride={{marginLeft: 8}}/>:(transactions.length > 0 ?  transactions.map((tx)=>(
                    <div className="tx-body" key={tx.id}>
                        <div className="type-amount-date">
                            <p className={tx.type === 'credit'?"type credit":"type debit"}>
                                {tx.txType ==='credit'? tx.txType + '  <-  ' + tx.from: tx.txType + '  ->  ' + tx.to }
                            </p>
                            <p className="amount">
                                {tx.txAmount}
                            </p>
                            <p className="date">
                                {tx.txDate}
                            </p>
                        </div>
                        <div className="time-container">
                            <p className="time">
                                {tx.txTime}
                            </p>
                        </div>
                    </div>
                )): <h4>No Transaction data. deposit or transfer</h4>)}
               
               
            </div>
        </div>
    </main>
}