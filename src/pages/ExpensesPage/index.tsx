import { TableComponent } from "../../components/Table"
import { Box } from "@chakra-ui/react"

export const ExpensesPage = () => {

    return (
        <>
            <Box width={"100%"}>
                <TableComponent
                    page="expenses" />
            </Box>

        </>
    )
}