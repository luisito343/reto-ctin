import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

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
        <Container className="my-5"> 
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <Card.Title as="h3" className="mb-4">
                                {initialData ? 'Editar Startup' : 'Nueva Startup'}
                            </Card.Title>
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Form.Group as={Col} md="6" controlId="formGridName">
                                        <Form.Label>Nombre:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formGridFoundedAt">
                                        <Form.Label>Fecha de Fundación:</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="foundedAt" 
                                            value={formData.foundedAt} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} xs="12" controlId="formGridLocation">
                                        <Form.Label>Ubicación:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="location" 
                                            value={formData.location} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formGridCategory">
                                        <Form.Label>Categoría:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formGridFunding">
                                        <Form.Label>Inversión Recibida ($):</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="fundingAmount" 
                                            value={formData.fundingAmount} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Ej: 50000"
                                        />
                                    </Form.Group>
                                </Row>
                                
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    {/* Componentes Button con la prop 'variant' para el estilo */}
                                    <Button variant="light" onClick={onCancel}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Guardar
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default StartupForm