import React, { useState } from "react";
import './UpdateBalance.css'; 
import { useApp } from "../../../context/AppContext";
import supabase from "../../../services/supabase-client";

function UpdateCard() {

    var riskGood = true;
    var balanceGood = true; 

    const {balance, setBalance} = useApp(); 
    
    const updateBalance = async (e) => {
        const btn = e.target; 
        const parent = btn.parentNode; 
        const children = parent.childNodes; 
        const accBalanceUpdateField = children[0]; 
        const accBalanceUpdateValue = accBalanceUpdateField.childNodes[1].value; 
        const riskBalanceUpdateField = children[1]; 
        const riskBalanceUpdateValue = riskBalanceUpdateField.childNodes[1].value; 

        // Prevent user from submitting 0 or empty
        if (accBalanceUpdateValue === 0 || accBalanceUpdateValue === "") {
            const balanceInput = accBalanceUpdateField.children[1]; 
            balanceInput.style.border = "1px solid red"; 
            balanceInput.animate([
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0px)' },
            ],
                {
                    duration: 500,
                    easing: 'ease-out',
                    iterations: 1,
                    fill: 'forwards'
                }
            )
            balanceGood = false; 
        } else {
            const balanceInput = accBalanceUpdateField.children[1]; 
            balanceInput.style.border = "1px solid black"; 
            balanceGood = true; 
        }

        if (riskBalanceUpdateValue === 0 || riskBalanceUpdateValue === "") {
            const riskInput = riskBalanceUpdateField.children[1]; 
            riskInput.style.border = "1px solid red"; 
            riskInput.animate([
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0px)' },
            ],
                {
                    duration: 500,
                    easing: 'ease-out',
                    iterations: 1,
                    fill: 'forwards'
                }
            )
            riskGood = false; 
        } else {
            const riskInput = riskBalanceUpdateField.children[1]; 
            riskInput.style.border = "1px solid black"; 
            riskGood = true; 
        }

        if (!balanceGood || !riskGood) {
            return; 
        } 
        console.log("Before:", balance); 
        // All else passes here
        setBalance(prevBalance => ({
            ...prevBalance, 
            liveBalance: Number(accBalanceUpdateValue), 
            total: Number(accBalanceUpdateValue), 
            riskPctMax: Number(riskBalanceUpdateValue)
        }))
        console.log("After:", balance); 
        try {
            const {data, error} = await supabase
                .from('balance_updates')
                .insert({
                    balance: Number(accBalanceUpdateValue), 
                    total: Number(accBalanceUpdateValue), 
                    risk_pct_max: Number(riskBalanceUpdateValue), 
                    update_type: 'manual'
                }); 

            if (error) {
                throw error; 
            } else {
                console.log("Balance update saved successfully"); 
            }

        } catch (error) {
            console.log("Error saving balance update: ", error); 
        }


    }

    return (
        <div className="UpdateCardContainer">
            <UpdateConfirmationField header="Account Balance" content=''></UpdateConfirmationField>
            <UpdateConfirmationField header="Maximum Risk Percent" content=''></UpdateConfirmationField>
            <button className="btn btn-confirm" onClick={updateBalance}>Confirm</button>
        </div>
    )
}

export function UpdateConfirmationField({header, content}) {
    const [FieldValue, setFieldValue] = useState(content); 
    const value = FieldValue; 

    const ValueChange = (e) => {
        setFieldValue((e.target.value)); 
    }

    return (
        <div className="PositionFieldUpdate">
            <span className="PositionHeaderUpdate">{header}</span>
            <input type="number" id="PositionInputUpdate" onChange={ValueChange} value={value}/>
        </div>
    )
}

export default UpdateCard; 