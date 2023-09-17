import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: 'user',
    initialState:{
        access_token:'',
        user:{
            id:"",
            email:"",
            phoneNumber:"",
            username:"",
            acctBalance:"",
            txPin:"",
        }
    },
    reducers:{
            withdrawAmount:(state, action)=>{
                state.user.acctBalance = (parseFloat(state.user.acctBalance) - parseFloat(action.payload.amount )).toString() 
            },
            depositamount:(state, action)=>{

               state.user.acctBalance = (parseFloat(state.user.acctBalance) + parseFloat(action.payload.amount )).toString() 
            },
         savedata:(state, action)=>{
            state.access_token = action.payload.access_token;
            state.user = action.payload.user;
            
         },
         resetdata:(state)=>{
            state.access_token = '';
            state.user = {
                id:"",
                email:"",
                phoneNumber:"",
                username:"",
                acctBalance:"",
                txPin:"",
            }
         }
    }
})

export const {savedata, resetdata, depositamount, withdrawAmount} = user.actions
export default user.reducer         