import Swal from "sweetalert2";
import './style.css';

export const InfoMessage = (message: string) => {
    Swal.fire({
        icon: "warning",
        title: "Alerta!",
        text: message,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        background: '#8cff9a',
        color: 'black',
        toast: true,
        customClass: {
            popup: 'custom-toast',
            icon: 'custom-warning-icon',
        },
    });
};
