import { useEffect, useState } from "react";
import supabase from "../services/supabase-client";
import { ComplexHeader } from "../components/UI/Header";
import { useApp } from "../context/AppContext";
import SummaryCard from "../components/UI/AccountSummary/SummaryCard";
import BalanceBanner from "../components/UI/AccountSummary/BalanceBanner";
import UpdateCard from "../components/UI/AccountSummary/UpdateBalance";
import "./Settings.css"; 

function Settings() {

    const {balance, setBalance} = useApp(); 
    var liveBalance = balance.liveBalance; 
    var liveRisk = balance.riskPctMax; 

    return (
        <div className="SettingsMainContainer">
            <ComplexHeader content="Account Settings" page="settings"></ComplexHeader>
            <div className="SettingsContainer">
                <BalanceBanner balance={`$${liveBalance.toFixed(2)}`} risk={`${liveRisk}%`}></BalanceBanner>
                <UpdateCard></UpdateCard>
            </div>
        </div>
    )
}

export default Settings; 