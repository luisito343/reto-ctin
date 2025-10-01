import { useState, useEffect } from 'react'
import apiClient from '../services/api'
import TechnologyForm from '../components/TechnologyForm';

export default function TechnologiesPage() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTechnology, setEditingTechnology] = useState(null);

    const [filters, setFilters] = useState({ sector: '', adoptionLevel: '' });

    const fetchTechnologies = async (filterParams = {}) => {
        try {
            setLoading(true);
            // Pasamos los filtros como 'params' a axios, que los convertirá en query string
            const response = await apiClient.get('/technologies/read', { params: filterParams });
            setTechnologies(response.data);
            setError(null);
        } catch (err) {
            setError('Error al obtener los datos de technologies.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnologies(); // Llama a la función sin filtros la primera vez que carga la página
    }, []);

    const handleCreateTechnology = async (formData) => {
        try {
            // Hacemos la petición POST para crear la nueva startup
            const response = await apiClient.post('/technologies/create', formData);
            console.log('Datos recibidos del backend:', response.data.technology);
            console.log('Actualizando la lista de Technolgies...');
            // Añadimos la nueva startup a nuestra lista local para que se vea al instante
            setTechnologies(prevtechnology => [...prevtechnology, response.data.technology]);
            setShowForm(false); // Ocultamos el formulario después de crear
            setError(null);
        } catch (err) {
            setError('Error al crear Technology.');
            console.error(err);
        }
    };

    const handleUpdateTechnology = async (formData) => {
        try {
            const response = await apiClient.put(`/technologies/update/${editingTechnology.id}`, formData);
            // Actualizamos la lista local reemplazando el objeto viejo por el nuevo
            setTechnologies(prev => prev.map(s => s.id === editingTechnology.id ? response.data.technology : s));
            setEditingTechnology(null); // Cerramos el formulario de edición
            setError(null);
        } catch (err) {
            setError('Error al actualizar Technology.');
            console.error(err);
        }
    };

    const handleDeleteTechnology = async (id) => {
        // Pedimos confirmación al usuario
        if (window.confirm('¿Estás seguro de que quieres eliminar esta Tecnologia?')) {
            try {
                // Hacemos la petición DELETE a la API
                await apiClient.delete(`/technologies/delete/${id}`);
                // Actualizamos el estado local para quitar la tecnologia eliminada
                setTechnologies(prevtechnology => prevtechnology.filter(t => t.id  !== id));
                setError(null);
            } catch (err) {
                setError('Error al eliminar la startup.');
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTechnology(null);
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchTechnologies(filters);
    };

    const handleClearFilters = () => {
        setFilters({ sector: '', adoptionLevel: '' });
        fetchTechnologies();
    };

    if (loading) return <div>Cargando technologias...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Lista de technologias</h1>
            {!showForm && (
                <button onClick={() => setShowForm(true)}>
                    Crear Nueva tecnologia
                </button>
            )}

            {showForm && (
                <TechnologyForm
                    onSubmit={handleCreateTechnology}
                    onCancel={handleCancel}
                />
            )}

            {editingTechnology && (
                <TechnologyForm
                    initialData={editingTechnology}
                    onSubmit={handleUpdateTechnology}
                    onCancel={handleCancel}
                />
            )}

            <form onSubmit={handleFilterSubmit} style={{ margin: '20px 0' }}>
                <h3>Filtrar technology</h3>
                <input
                    type="text"
                    name="sector"
                    placeholder="Filtrar por sector..."
                    value={filters.sector}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    name="adoptionLevel"
                    placeholder="Filtrar por nivel de adopción..."
                    value={filters.adoptionLevel}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">Filtrar</button>
                <button type="button" onClick={handleClearFilters} style={{ marginLeft: '10px' }}>
                    Limpiar Filtros
                </button>
            </form>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <ul>
                    {technologies.map(technology => (
                        <li key={technology.id} style={{ marginBottom: '10px' }}>
                            {technology.name} - {technology.sector}
                            <button onClick={() => setEditingTechnology(technology)} style={{ marginLeft: '10px' }}>
                                Editar
                            </button>
                            <button onClick={() => handleDeleteTechnology(technology.id)} style={{ marginLeft: '5px' }}>
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}