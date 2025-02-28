import Swal from "sweetalert2";
import './style.css';

export const ErrorMessage = (message: string) => {
    Swal.fire({
        icon: "error",
        title: "Erro!",
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
