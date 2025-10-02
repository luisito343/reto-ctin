import { useState, useEffect } from 'react'
import apiClient from '../services/api'
import StartupForm from '../components/StartupForm';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

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

    const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    if (loading) return <div>Cargando startups...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Container className="py-4">
                <Row className="align-items-center mb-4">
                    <Col>
                        <h1 className="mb-0">Lista de Startups</h1>
                    </Col>
                    <Col xs="auto">
                        {/* Solo mostramos el botón si no hay un formulario activo */}
                        {!showForm && !editingStartup && (
                            <Button variant="primary" onClick={() => setShowForm(true)}>
                                <PlusLg size={20} className="me-2" />
                                Crear Nueva Startup
                            </Button>
                        )}
                    </Col>
                </Row>

                {showForm && (
                    <div className="mb-4">
                        <StartupForm
                            onSubmit={handleCreateStartup}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                {editingStartup && (
                    <div className="mb-4">
                        <StartupForm
                            initialData={editingStartup}
                            onSubmit={handleUpdateStartup}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                {!showForm && !editingStartup && (
                    <Card className="bg-light border-0">
                        <Card.Body>
                            <Form onSubmit={handleFilterSubmit}>
                                <Row className="g-3 align-items-end">
                                    <Col md>
                                        <Form.Group controlId="filterName">
                                            <Form.Label>Filtrar por nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Ej: Innovatech"
                                                value={filters.name}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md>
                                        <Form.Group controlId="filterCategory">
                                            <Form.Label>Filtrar por categoría</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="category"
                                                placeholder="Ej: Fintech"
                                                value={filters.category}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="auto" className="d-flex">
                                        <Button variant="secondary" type="submit" className="me-2">Filtrar</Button>
                                        <Button variant="outline-secondary" type="button" onClick={handleClearFilters}>
                                            Limpiar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                )}
            </Container>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <Row className='m-4'>
                    {startups.map(startup => (
                        <Col xs={12} md={6} lg={4} key={startup.id} className="mb-4">
                            <Card style={{ width: '100%' }} key={startup.id}>
                                <Card.Body>
                                    <Card.Title>{startup.name}</Card.Title>
                                    <Card.Subtitle className="d-block text-muted"><strong>Categoría:</strong> {startup.category}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Ubicación:</strong> {startup.location} <br />
                                        <strong>Fecha de Fundación:</strong> {new Date(startup.foundedat).toLocaleDateString()} <br />
                                        <strong>Inversión Recibida:</strong> ${currencyFormatter.format(startup.fundingamount)}
                                    </Card.Text>
                                    <Button variant="secondary" size="sm" onClick={() => setEditingStartup(startup)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteStartup(startup.id)}>
                                        Eliminar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}