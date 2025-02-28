import { IRegister } from "@/interfaces/register";
import { containsXSS, constaisSQLInjection } from "../../security/xss";
import { Box, Button, Flex, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const RegisterPage = () => {

    const [firstNameValue, setFirstNameValue] = useState<string>('');
    const [lastNameValue, setLastNameValue] = useState<string>('');
    const [emailValue, setEmailValue] = useState<string>('');
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [withXSS, setWithXss] = useState<boolean>(false);
    const [withSqlI, setWithSqlI] = useState<boolean>(false);

    const navigate = useNavigate();

    const toast = useToast();

    const body: IRegister = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        password: passwordValue,
        isActive: true,
    }

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (containsXSS(event.target.value)) {

            setWithXss(true);

            toast({
                title: 'XSS?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });

        }
        else if(constaisSQLInjection(event.target.value)){

            setWithSqlI(true);

            toast({
                title: 'SQL INJECTION?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });
        }else {
            setFirstNameValue(event.target.value);
        }
        
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (containsXSS(event.target.value)) {

            setWithXss(true);

            toast({
                title: 'XSS?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });

        }
        else if(constaisSQLInjection(event.target.value)){

            setWithSqlI(true);

            toast({
                title: 'SQL INJECTION?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });
        }else {

            setLastNameValue(event.target.value);
        }

        
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (containsXSS(event.target.value)) {

            setWithXss(true);

            toast({
                title: 'XSS?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });

        }
        else if(constaisSQLInjection(event.target.value)){

            setWithSqlI(true);

            toast({
                title: 'SQL INJECTION?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });
        }else {

            setEmailValue(event.target.value);
        }
        
        
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (containsXSS(event.target.value)) {

            setWithXss(true);

            toast({
                title: 'XSS?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });

        }
        else if(constaisSQLInjection(event.target.value)){

            setWithSqlI(true);

            toast({
                title: 'SQL INJECTION?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });
        }else {

            setPasswordValue(event.target.value);
        }

        
    };

    const handleSubmit = async (event: React.FormEvent) => {

        event.preventDefault();

        setIsLoading(true);

        try {

            const response: any = await axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/users/create`, body);

            toast({
                title: 'Registro realizado com sucesso!',
                description: `${response.message}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000)
        }
        catch (error: any) {
            toast({
                title: 'Erro no registro',
                description: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }

    }

    return (

        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="#dcffe0"
        >
            <Box
                p={"4rem"}
                width={"35rem"}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
                bg="#8cff9a"
            >
                <Heading mb={10} textAlign="center" size="lg">
                    Registro
                </Heading>
                <form onSubmit={handleSubmit}>

                    <FormControl id="firstName" mb={4}>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            type="text"
                            bg={"#dcffe0"}
                            placeholder="Digite seu nome"
                            _placeholder={{ color: "#c9cac8" }}
                            focusBorderColor="black"
                            value={firstNameValue}
                            onChange={handleFirstNameChange}
                            isDisabled={withXSS || withSqlI}
                        />
                    </FormControl>

                    <FormControl id="lastName" mb={4}>
                        <FormLabel>Sobrenome</FormLabel>
                        <Input
                            type="text"
                            bg={"#dcffe0"}
                            placeholder="Digite seu sobrenome"
                            _placeholder={{ color: "#c9cac8" }}
                            focusBorderColor="black"
                            value={lastNameValue}
                            onChange={handleLastNameChange}
                            isDisabled={withXSS || withSqlI}
                        />
                    </FormControl>

                    <FormControl id="email" mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="text"
                            bg={"#dcffe0"}
                            placeholder="Digite seu login"
                            _placeholder={{ color: "#c9cac8" }}
                            focusBorderColor="black"
                            value={emailValue}
                            onChange={handleEmailChange}
                            isDisabled={withXSS || withSqlI}
                        />
                    </FormControl>

                    <FormControl id="password" mb={6}>
                        <FormLabel>Senha</FormLabel>
                        <Input
                            type="password"
                            bg={"#dcffe0"}
                            placeholder="Digite sua senha"
                            _placeholder={{ color: "#c9cac8" }}
                            focusBorderColor="black"
                            value={passwordValue}
                            onChange={handlePasswordChange}
                            isDisabled={withXSS || withSqlI}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        width="full"
                        bg={"black"}
                        color={"#dcffe0"}
                        _hover={{
                            color: "#8cff9a",
                            transform: 'scale(1.02)',
                            transition: 'transform 0.5s ease-in-out',
                        }}
                        isLoading={isLoading}
                        isDisabled={withXSS || withSqlI}
                    >
                        Entrar
                    </Button>
                </form>
            </Box>
        </Flex>
    )
}
