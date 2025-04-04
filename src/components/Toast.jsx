import React, { useEffect, useRef } from 'react';

const Toast = ({ message, show, setShow }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        if (show) {
            // Hide toast after 3 seconds
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [show, setShow]);

    if (!show) return null;

    return (
        <div className="position-fixed bottom-0 start-50 translate-middle-x p-3" style={{ zIndex: 9999 }}>
            <div 
                ref={toastRef}
                className="toast show align-items-center text-white bg-primary border-0" 
                role="alert" 
                aria-live="assertive" 
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white me-2 m-auto" 
                        onClick={() => setShow(false)}
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Toast;