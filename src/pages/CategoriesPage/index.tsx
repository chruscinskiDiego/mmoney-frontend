import { TableComponent } from "../../components/Table"
import { Box } from "@chakra-ui/react"

export const CategoriesPage = () => {

    return (
        <>
            <Box width={"100%"}>
                <TableComponent
                    page="categories" />
            </Box>
        </>
    )
}