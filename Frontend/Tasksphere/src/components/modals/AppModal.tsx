import type React from "react";
import { Modal } from "react-bootstrap";


interface AppModalProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    children: React.ReactNode;
}


export const AppModal = ({ show, handleClose, title, children }: AppModalProps) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title className="h5 fw-bold">{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {children}
            </Modal.Body>

        </Modal>
    );
}