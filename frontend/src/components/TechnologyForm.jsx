import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

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
        <Container className="my-5"> 
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <Card.Title as="h3" className="mb-4">
                                {initialData ? 'Editar Technology' : 'Nueva Technology'}
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

                                    <Form.Group as={Col} md="6" controlId="formGridSector">
                                        <Form.Label>Sector:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="sector" 
                                            value={formData.sector} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} xs="12" controlId="formGridLocation">
                                        <Form.Label>Descripción:</Form.Label>
                                        <Form.Control 
                                            as={"textarea"} 
                                            rows={3}
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formGridCategory">
                                        <Form.Label>Nivel de Adopción:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="adoptionLevel" 
                                            value={formData.adoptionLevel} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="mt-4">
                                    <Button variant="primary" type="submit" className="me-2">
                                        {initialData ? 'Actualizar' : 'Crear'}
                                    </Button>
                                    <Button variant="secondary" onClick={onCancel}>
                                        Cancelar
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

export default TechnologyForm;