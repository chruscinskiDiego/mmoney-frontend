import { Text, Flex, SkeletonCircle, SkeletonText, Skeleton, Box } from '@chakra-ui/react';

export const AppLoader = () => {
    return (
        <Box height="100vh" overflow="hidden">
            <Flex height="100%" align="stretch">
                {/* Primeiro box com 13% da largura */}
                <Box width="13%" bg="gray.100">
                    <Skeleton height="100%" width="100%"/>
                </Box>

                <Box width="87%" height="100vh" bg="gray.50">
                    <Flex
                        height="100%"
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        p="4"
                    >
                        <SkeletonCircle size="20" />
                        <Text mt={4} fontSize="lg" color="gray.600" fontWeight="semibold">
                            Carregando dados...
                        </Text>
                        <SkeletonText noOfLines={10} width={"50%"}spacing="10" mt={6}>carregando...</SkeletonText>

                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};
