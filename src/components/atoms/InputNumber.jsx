export default function InputNumber({
    label,
    value,
    onChange,
    min = 0,
    required = false
}) {
    return(
        <div className="input-field">
            <label className="input-label">{label}{required && " *"}</label>
            <input 
                type="number"
                className="input-base"
                value={value}
                min={min}
                onChange={onChange}
                required={required}
            />

        </div>
    );
}