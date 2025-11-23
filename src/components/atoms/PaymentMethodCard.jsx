import React from "react";
import "../../styles/paymentMethodCard.css";

export const PaymentMethodCard = ({ title, subtitle, icon, selected, oncClick }) => {
    return (
        <div
        className={`payment-method-card ${selected ? "selected" : ""}`}
        onClick={oncClick}
        >
            <div className="icon">{icon}</div>
            <div className="text-container">
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>
        </div>
    );
};
