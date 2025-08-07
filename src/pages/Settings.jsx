import { useEffect, useState } from "react";
import supabase from "../services/supabase-client";
import { ComplexHeader } from "../components/UI/Header";
import "./Settings.css"; 

function Settings() {
    return (
        <div className="SettingsContainer">
            <ComplexHeader content="Account Settings" page="settings"></ComplexHeader>

        </div>
    )
}

export default Settings; 