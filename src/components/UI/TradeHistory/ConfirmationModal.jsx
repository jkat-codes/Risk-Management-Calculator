import { useState } from "react";
import { createPortal } from "react-dom";
import "./ConfirmationModal.css";
import {Header} from "../Header";

export function PositionConfirmationField({ header, content }) {
    const [FieldValue, setFieldValue] = useState(content);
    const value = FieldValue;

    const ValueChange = (e) => {
        setFieldValue(e.target.value);
    }

    return (
        <div className="PositionField">
            <div className="ContractsContainer">
                <span className="PositionHeader">{header}</span>
            </div>
            <input id="PositionInput" type="number" onChange={ValueChange} value={value} />
        </div>
    )
}

export function ContractConfirmationField({ header, content }) {
    const [ContractsValue, setContractsValue] = useState(content);
    const contractsVal = ContractsValue;
    const OriginalContracts = content;

    const ContractsChange = (e) => {
        setContractsValue(e.target.value);
    }

    return (
        <div className="PositionField">
            <div className="ContractsContainer">
                <span className="PositionHeader">{header}</span>
                <span className="PositionHeader">{`${OriginalContracts} → ${OriginalContracts - contractsVal != "" ? OriginalContracts - contractsVal : 0}`}</span>
            </div>
            <input id="PositionInput" type="number" onChange={ContractsChange} value={contractsVal} />
        </div>
    )
}

export function ConfirmationModal({ headerContent, onClose, onConfirm, close, contracts, plval, plpct }) {

    const modal = (
        <div className="ModalOverlay">
            <div className="ModalContent">
                <Header content={headerContent}></Header>
                <PositionConfirmationField header="EXIT PRICE*" content={close}></PositionConfirmationField>
                <ContractConfirmationField header="CONTRACTS" content={contracts}></ContractConfirmationField>
                <PositionConfirmationField header="P&L AMOUNT" content={plval}></PositionConfirmationField>
                <PositionConfirmationField header="P&L PERCENT" content={plpct}></PositionConfirmationField>
                <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn btn-confirm" onClick={onConfirm}>{headerContent === 'Peel Position' ? "Peel Position" : "Close Position"}</button>
            </div>
        </div>
    )

    const modalRoot = document.getElementById("MainContainer") || document.body;
    return createPortal(modal, modalRoot);
}

export default ConfirmationModal; 