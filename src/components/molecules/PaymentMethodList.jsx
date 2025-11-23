import React from "react";
import { PaymentMethodCard } from "../atoms/PaymentMethodCard";

export const PaymentMethodList = ({ selected, onSelect }) => {
    return (
        <>
            <p className="metodo-titulo">Tarjetas</p>
            <div
                className={`payment-method-card ${selected === "tarjetas" ? "selected" : ""}`}
                onClick={() => onSelect("tarjetas")}
            >
                <span className="icon">💳</span>
                Crédito, Débito, Prepago
            </div>

            <p className="metodo-titulo">OnePay</p>
            <div
                className={`payment-method-card ${selected === "onepay" ? "selected" : ""}`}
                onClick={() => onSelect("onepay")}
            >
                <span className="icon">📱</span>
                Otras billeteras digitales
            </div>
        </>
    );
};