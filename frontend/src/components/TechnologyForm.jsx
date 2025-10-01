import { useState, useEffect } from 'react';

// El componente recibe una función 'onSubmit' y un 'onCancel' desde el padre
function TechnologyForm({ onSubmit, onCancel, initialData }) {
    // Usamos un solo estado para manejar todos los campos del formulario
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        description: '',
        adoptionLevel: ''
    });

    useEffect(() => {
        if (initialData) {
            
            setFormData({
                name: initialData.name || '',
                sector: initialData.sector || '',
                description: initialData.description || '',
                adoptionLevel: initialData.adoptionlevel || ''
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
            <h3>{initialData ? 'Editar Tecnologia' : 'Nueva Tecnologia'}</h3>
            <div>
                <label>Nombre:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Sector:</label>
                <input type="text" name="sector" value={formData.sector} onChange={handleChange} required />
            </div>
            <div>
                <label>Descripción:</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Nivel de adopción:</label>
                <input type="text" name="adoptionLevel" value={formData.adoptionLevel} onChange={handleChange} required />
            </div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}

export default TechnologyForm;