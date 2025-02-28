import { Box, Text, VStack, Heading } from "@chakra-ui/react";

interface IStatisticsCard {
    head: any;
    value: string;
    text: string;
}
export const StatisticsCard = ({ head, value, text }: IStatisticsCard) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width={"md"}
      boxShadow="md"
      backgroundColor={"#8cff9a"}
      p={"0"}
    >

      <Box
        backgroundColor={"black"}
        color={"black"}
        w={"100%"}
        p={"4"}
        borderTopRadius="lg"
        position="sticky"
        top="0"
        zIndex="1"
      >
        <Heading as="h3" size="md" textAlign="center" color={"white"}>
          {head}
        </Heading>
      </Box>

      <VStack spacing={4} p={"7"}>
        <Text color={"black"}>
          {text} {value}
        </Text>
      </VStack>
    </Box>
  );
};
