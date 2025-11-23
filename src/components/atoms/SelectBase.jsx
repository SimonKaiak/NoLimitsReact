export default function SelectBase({
    label,
    value,
    onChange,
    options = [],
    required = false
}) {
    return (
        <div className="input-field">
            <label className="input-label">{label}{required && " *"}</label>
            <select
                className="input-base"
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Seleccionar...</option>

                {options.map(opt => (
                    <option key={opt.id} value={opt.id}>
                        {opt.nombre} 
                    </option>
                ))}
            </select>

        </div>

    );
}