import { ILogin } from '@/interfaces/login';
import { Box, Button, Flex, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useState } from 'react';
import { containsXSS, constaisSQLInjection } from '../../security/xss';
import { AuthService } from '../../services/AuthService'
import { AppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";


export const LoginPage = () => {
    const [emailValue, setEmailValue] = useState<string>('');
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appContext = useContext(AppContext);
    const { setIsLoggedIn } = appContext;
    const navigate = useNavigate();
    const [withXSS, setWithXss] = useState<boolean>(false);
    const [withSqlI, setWithSqlI] = useState<boolean>(false);

    const toast = useToast();

    const body: ILogin = {
        email: emailValue,
        password: passwordValue
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
        }else if(constaisSQLInjection(event.target.value)){

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
        }else if(constaisSQLInjection(event.target.value)){

            setWithSqlI(true);

            toast({
                title: 'SQL INJECTION?',
                description: `Para com isso...`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                colorScheme: "red"
            });
        }
        else {
            setPasswordValue(event.target.value);
        }

        
    };

    const handleSubmit = async (event: React.FormEvent) => {

        event.preventDefault();
        setIsLoading(true);

        try {

            const response = await axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/login/auth`, body);

            AuthService.login(response.data.token.token);
            Cookies.set('user', response.data.token.user.email);

            setIsLoggedIn(true);

            toast({
                title: 'Login realizado com sucesso!',
                description: `Bem-vindo, ${emailValue}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setTimeout(() => {
                navigate('/home');
            }, 1000);

        } catch (error) {
            toast({
                title: 'Erro no login',
                description: 'Verifique suas credenciais.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                    Login
                </Heading>
                <form onSubmit={handleSubmit}>
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
    );
};
