import { Box, Spinner } from "@chakra-ui/react";

export const SpinnerLoader = () => {
    return (
        <Box 
            width="100%" 
            height="100vh" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
        >
            <Spinner size="xl" speed="1s" color="black" thickness="6px" />
        </Box>
    );
};
