import { useState, useEffect } from 'react';

// El componente recibe una función 'onSubmit' y un 'onCancel' desde el padre
function StartupForm({ onSubmit, onCancel, initialData }) {
    // Usamos un solo estado para manejar todos los campos del formulario
    const [formData, setFormData] = useState({
        name: '',
        foundedAt: '',
        location: '',
        category: '',
        fundingAmount: ''
    });

    useEffect(() => {
        if (initialData) {
            // Formateamos la fecha para que el input type="date" la entienda
            const formattedDate = initialData.foundedat ? new Date(initialData.foundedat).toISOString().split('T')[0] : '';
            setFormData({
                name: initialData.name || '',
                foundedAt: formattedDate,
                location: initialData.location || '',
                category: initialData.category || '',
                fundingAmount: initialData.fundingamount || ''
            });
        }
    }, [initialData]);

    // Una sola función para manejar los cambios en todos los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);  // Llama a la función que le pasó el componente padre
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{initialData ? 'Editar Startup' : 'Nueva Startup'}</h3>
            <div>
                <label>Nombre:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Fecha de Fundación:</label>
                <input type="date" name="foundedAt" value={formData.foundedAt} onChange={handleChange} required />
            </div>
            <div>
                <label>Ubicación:</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
                <label>Categoría:</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div>
                <label>Inversión Recibida:</label>
                <input type="number" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} required />
            </div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}

export default StartupForm