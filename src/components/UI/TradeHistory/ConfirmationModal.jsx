import { useState } from "react";
import { createPortal } from "react-dom";
import "./ConfirmationModal.css";
import Header from "../Header";

export function PositionConfirmationField({ header, content }) {
    const [FieldValue, setFieldValue] = useState(content);
    const value = FieldValue;

    const ValueChange = (e) => {
        setFieldValue(e.target.value);
    }

    return (
        <div className="PositionField">
            <span className="PositionHeader">{header}</span>
            <input id="PositionInput" type="number" onChange={ValueChange} value={value} />
        </div>
    )
}

export function ConfirmationModal({ onClose, onConfirm, close, contracts, plval, plpct }) {

    const modal = (
        <div className="ModalOverlay">
            <div className="ModalContent">
                <Header content="Close Position"></Header>
                <PositionConfirmationField header="EXIT PRICE*" content={close}></PositionConfirmationField>
                <PositionConfirmationField header="CONTRACTS" content={contracts}></PositionConfirmationField>
                <PositionConfirmationField header="P&L AMOUNT" content={plval}></PositionConfirmationField>
                <PositionConfirmationField header="P&L PERCENT" content={plpct}></PositionConfirmationField>
                <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn btn-confirm" onClick={onConfirm}>Close Position</button>
            </div>
        </div>
    )

    const modalRoot = document.getElementById("MainContainer") || document.body;
    return createPortal(modal, modalRoot);
}

export default ConfirmationModal; 