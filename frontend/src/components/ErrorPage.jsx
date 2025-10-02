import { Alert } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';


export default function ErrorPage({error}) {
    return (
        <Alert variant="danger" className="d-flex align-items-center">
                <ExclamationTriangleFill size={24} className="me-3" />
                <div>
                    <Alert.Heading as="h5" className="mb-1">Error al cargar los datos</Alert.Heading>
                    <p className="mb-0">{error}</p>
                </div>
            </Alert>
    );
}