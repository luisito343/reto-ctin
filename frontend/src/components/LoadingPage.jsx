import { Spinner } from 'react-bootstrap';

export default function LoadingPage({page}) {
    return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" className="me-2">
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <strong>Cargando... {page}</strong>
        </div>
    );
}