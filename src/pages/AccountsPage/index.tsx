import { TableComponent } from "../../components/Table"
import { Box } from "@chakra-ui/react"

export const AccountsPage = () => {

    return (
        <>
            <Box>
                <TableComponent
                page="accounts"/>
            </Box>
        </>
    )
}