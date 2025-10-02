import { useState, useEffect } from 'react'
import apiClient from '../services/api'
import TechnologyForm from '../components/TechnologyForm';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

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
                setTechnologies(prevtechnology => prevtechnology.filter(t => t.id !== id));
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
            <Container className="py-4">
                <Row className="align-items-center mb-4">
                    <Col className='my-2'>
                        <h1 className="mb-0">Lista de Tecnologias</h1>
                    </Col>
                    <Col xs="auto">
                        {/* Solo mostramos el botón si no hay un formulario activo */}
                        {!showForm && !editingTechnology && (
                            <Button variant="primary" onClick={() => setShowForm(true)}>
                                <PlusLg size={20} className="me-2" />
                                Crear Nueva Tecnología
                            </Button>
                        )}
                    </Col>
                </Row>

                {showForm && (
                    <div className="mb-4">
                        <TechnologyForm
                            onSubmit={handleCreateTechnology}
                            onCancel={handleCancel}
                            initialData={editingTechnology}
                        />
                    </div>
                )}

                {editingTechnology && (
                    <div className="mb-4">
                        <TechnologyForm
                            onSubmit={handleUpdateTechnology}
                            onCancel={handleCancel}
                            initialData={editingTechnology}
                        />
                    </div>
                )}

                {!showForm && !editingTechnology && (
                    <Card className="bg-light border-0">
                        <Card.Body>
                            <Form onSubmit={handleFilterSubmit}>
                                <Row className="g-3 align-items-end">
                                    <Col md>
                                        <Form.Group controlId="filterSector">
                                            <Form.Label>Filtrar por sector</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sector"
                                                placeholder="Ej: advanced materials"
                                                value={filters.sector}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md>
                                        <Form.Group controlId="filterAdoptionLevel">
                                            <Form.Label>Filtrar por Nivel de adopción </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="adoptionLevel"
                                                placeholder="Ej: Innovators"
                                                value={filters.adoptionLevel}
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
                <Row className='m-4 '>
                    {technologies.map(technology => (
                        <Col xs={12} md={6} lg={4} key={technology.id} className="mb-4">
                            <Card style={{ width: '100%' }} key={technology.id}>
                                <Card.Body>
                                    <Card.Title>{technology.name}</Card.Title>
                                    <Card.Subtitle className="d-block text-muted"><strong>Sector:</strong> {technology.sector}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Descripción:</strong> {technology.description} <br />
                                        <strong>Nivel de adopción:</strong> {technology.adoptionlevel}
                                    </Card.Text>
                                    <Button variant="secondary" size="sm" onClick={() => setEditingTechnology(technology)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteTechnology(technology.id)} style={{ marginLeft: '10px' }}>
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