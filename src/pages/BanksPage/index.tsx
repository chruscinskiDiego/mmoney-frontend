import { TableComponent } from "../../components/Table"
import { Box } from "@chakra-ui/react"

export const BanksPage = () => {

    return (
        <>
            <Box>
                <TableComponent
                    page="banks" />
            </Box>
        </>
    )
}