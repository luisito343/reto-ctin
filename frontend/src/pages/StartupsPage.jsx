import { useState, useEffect } from 'react'
import apiClient from '../services/api'
import StartupForm from '../components/StartupForm';

export default function StarupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingStartup, setEditingStartup] = useState(null);

    const [filters, setFilters] = useState({ name: '', category: '' });

    const fetchStartups = async (filterParams = {}) => {
        try {
            setLoading(true);
            // Pasamos los filtros como 'params' a axios, que los convertirá en query string
            const response = await apiClient.get('/startups/read', { params: filterParams });
            setStartups(response.data);
            setError(null);
        } catch (err) {
            setError('Error al obtener los datos de las startups.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartups(); // Llama a la función sin filtros la primera vez que carga la página
    }, []);

    const handleCreateStartup = async (formData) => {
        try {
            // Hacemos la petición POST para crear la nueva startup
            const response = await apiClient.post('/startups/create', formData);
            console.log('Datos recibidos del backend:', response.data);
            console.log('Actualizando la lista de startups...');
            // Añadimos la nueva startup a nuestra lista local para que se vea al instante
            setStartups(prevStartups => [...prevStartups, response.data.startup]);
            setShowForm(false); // Ocultamos el formulario después de crear
            setError(null);
        } catch (err) {
            setError('Error al crear la startup.');
            console.error(err);
        }
    };

    const handleUpdateStartup = async (formData) => {
        try {
            const response = await apiClient.put(`/startups/update/${editingStartup.id}`, formData);
            // Actualizamos la lista local reemplazando el objeto viejo por el nuevo
            setStartups(prev => prev.map(s => s.id === editingStartup.id ? response.data.startup : s));
            setEditingStartup(null); // Cerramos el formulario de edición
            setError(null);
        } catch (err) {
            setError('Error al actualizar la startup.');
            console.error(err);
        }
    };

    const handleDeleteStartup = async (id) => {
        // Pedimos confirmación al usuario
        if (window.confirm('¿Estás seguro de que quieres eliminar esta startup?')) {
            try {
                // Hacemos la petición DELETE a la API
                await apiClient.delete(`/startups/delete/${id}`);
                // Actualizamos el estado local para quitar la startup eliminada
                setStartups(prevStartups => prevStartups.filter(s => s.id !== id));
                setError(null);
            } catch (err) {
                setError('Error al eliminar la startup.');
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingStartup(null);
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
        fetchStartups(filters);
    };

    const handleClearFilters = () => {
        setFilters({ name: '', category: '' });
        fetchStartups();
    };

    if (loading) return <div>Cargando startups...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Lista de Startups</h1>
            {!showForm && (
                <button onClick={() => setShowForm(true)}>
                    Crear Nueva Startup
                </button>
            )}

            {showForm && (
                <StartupForm
                    onSubmit={handleCreateStartup}
                    onCancel={handleCancel}
                />
            )}

            {editingStartup && (
                <StartupForm
                    initialData={editingStartup}
                    onSubmit={handleUpdateStartup}
                    onCancel={handleCancel}
                />
            )}

            <form onSubmit={handleFilterSubmit} style={{ margin: '20px 0' }}>
                <h3>Filtrar Startups</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Filtrar por nombre..."
                    value={filters.name}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Filtrar por categoría..."
                    value={filters.category}
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
                    {startups.map(startup => (
                        <li key={startup.id} style={{ marginBottom: '10px' }}>
                            {startup.name} - {startup.category}
                            <button onClick={() => setEditingStartup(startup)} style={{ marginLeft: '10px' }}>
                                Editar
                            </button>
                            <button onClick={() => handleDeleteStartup(startup.id)} style={{ marginLeft: '5px' }}>
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}