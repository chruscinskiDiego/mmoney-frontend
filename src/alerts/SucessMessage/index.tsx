import Swal from "sweetalert2";
import './style.css';

export const SucessMessage = (message: string) => {
    Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: message,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        background: '#8cff9a',
        color: 'black',
        toast: true,
        customClass: {
            popup: 'custom-toast',
            icon: 'custom-success-icon'
        },
    });
    
};
