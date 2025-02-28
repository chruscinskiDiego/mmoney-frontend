import { Button, Icon, keyframes } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";

interface IAddButton {
    text: string;
    onClick: () => void;
}

export const AddButton = ({ text, onClick }: IAddButton) => {

    const swingAnimation = keyframes`
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(-10deg);
      }
      50% {
        transform: rotate(10deg);
      }
      75% {
        transform: rotate(-10deg);
      }
      100% {
        transform: rotate(10deg);
      }
    `;

    return (

        <Button
            background={"#8cff9a"}
            mb={3}
            onClick={onClick}
            _hover={{
                background: "black",
                color: "white",
            }}
        >
            <Icon fontSize={"25px"} as={BiPlus} _hover={{
                animation: `${swingAnimation} 0.3s ease-in-out`
            }} />
            {text}
        </Button>

    )
}