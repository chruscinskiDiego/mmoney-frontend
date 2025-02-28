// src/pages/HomePage.jsx
import { Box, Center, Grid, Text } from "@chakra-ui/react";
import { StatisticsCard } from "../../components/StatisticsCard";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import ExpensesChart from "../../components/ExpensesChart";
import { FaBitcoin } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io";
import { formatCurrency } from "../../utils/utils";
import CategoryChart from "../../components/CategoryChart";
import { AppContext } from "../../contexts/AppContext";

export const HomePage = () => {
    const [dolarValue, setDolarValue] = useState<string>("");
    const [bitcoinValue, setBitcoinValue] = useState<string>("");
    const [ethereumValue, setEthereumValue] = useState<string>("");

    const {user} = useContext(AppContext);

    console.log('usuario: '+ user);

    const getDolarValue = useCallback(async () => {
        try {

            const response = await axios.get("https://economia.awesomeapi.com.br/json/last/USD-BRL");

            const dolarValue = formatCurrency(response?.data?.USDBRL?.bid);

            setDolarValue(dolarValue);

        } catch (error) {
            console.error("Erro ao buscar valor do dólar!");
        }
    }, []);

    const getBitcoinValue = useCallback(async () => {

        try {

            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl");

            const bitcoinValue = formatCurrency(response?.data?.bitcoin?.brl);

            setBitcoinValue(bitcoinValue);

        } catch (error) {
            console.error("Erro ao buscar valor do bitcoin!");
        }
    }, []);

    const getEthereumValue = useCallback(async () => {

        try {

            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl");

            const ethereumValue = formatCurrency(response?.data?.ethereum?.brl);

            setEthereumValue(ethereumValue);

        } catch (error) {
            console.error("Erro ao buscar o valor do Ethereum!");
        }
    }, []);

    useEffect(() => {
        getDolarValue();
        getBitcoinValue();
        getEthereumValue();
    }, [getDolarValue, getBitcoinValue, getEthereumValue]);

    return (
        <>
            <Box>
                <Center>
                    <Grid display={"flex"}>
                        <Box padding={"5"}>
                            <StatisticsCard head={(
                                <>
                                    <Center>
                                        <IoLogoUsd /> Dólar
                                    </Center>
                                </>
                            )} text="Valor atual:" value={dolarValue || "Carregando..."} />
                        </Box>

                        <Box padding={"5"}>
                            <StatisticsCard head={(
                                <>
                                    <Center>
                                        <FaBitcoin /> Bitcoin
                                    </Center>
                                </>
                            )} text="Valor atual:" value={bitcoinValue || "Carregando..."} />
                        </Box>

                        <Box padding={"5"}>
                            <StatisticsCard head={(
                                <>
                                    <Center>
                                        <FaEthereum /> Ethereum
                                    </Center>
                                </>
                            )} text="Valor atual:" value={ethereumValue || "Carregando..."} />
                        </Box>
                    </Grid>
                </Center>
            </Box>

            <Box paddingTop={"2%"} display={"flex"} height={"70vh"}>

                <Box width="10%" />

                <Box width="45%" height="30rem" textAlign={"center"}>

                    <Text background={"#8cff9a"}>Gastos mensais:</Text>

                    <ExpensesChart />

                </Box>
                <Box width="35%" height="30rem" textAlign={"center"}>

                    <Text background={"black"} color={"white"}>Gastos por categoria:</Text>

                    <CategoryChart />
                </Box>
                <Box width="10%" />

            </Box>

        </>
    );
};
