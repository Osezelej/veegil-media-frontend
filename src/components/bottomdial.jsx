import { Drawer, Alert } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; 
import { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid';


export default function BottomDial({bottomDial, showBottomDial, txPin, validateUser, amount}){
    let data = ['1','2','3','4','5','6','7','8','9', '','0', '']
    const [circleNumber, setCircleNumber] = useState('');
    const [wPin, setWPin] = useState(false)
    const handleClick= (e)=>{
        console.log('txpin' ,txPin)
        console.log('circlenumber', circleNumber)
    

        if(e.length === 5){
            showBottomDial(false)
            if( circleNumber === txPin){
                
                validateUser(amount)

            }else{
                setWPin(true)
            }
            setCircleNumber('')
        }
    // eslint-disable-next-line
    }

    // eslint-disable-next-line
    useEffect(()=>{
        if(circleNumber.length){
            handleClick(circleNumber);

        }
    }, [circleNumber])
    useEffect(()=>{
        if(wPin){
            setTimeout(()=>{
                setWPin(false)
            }, 2500)
        }
    },[wPin])
    return <div>
        {wPin && <Alert severity="error" onClose={()=>{setWPin(false)}}>PIN ERROR - enter the right transaction pin</Alert>}
        <Drawer 
        anchor="bottom" 
        onClose={
            ()=>{
                bottomDial ? showBottomDial(false): showBottomDial(true)
                
                setCircleNumber('')
                }}
        open={bottomDial}
        >
        <Grid container spacing={0.5} rowSpacing={0.5} >
                <Grid xs={12} >
                    <div className="grid-size">
                        {data.slice(0, circleNumber.length).map((i)=>(<div className="grid-check" key={uuid()}></div>))}
                    </div>
                </Grid>
                {data.map((item, index)=>(<Grid xs={4} key={uuid()}>
                    <div className="grid-size" onClick={(e)=>{
                                setCircleNumber((prev)=>{
                                    return prev + data[index].toString()
                                })
                    }}>{item}</div>
                </Grid>))}
                
        </Grid>

        </Drawer>
    </div>
}