import { UseQueryResponse, gql, useQuery } from "urql";
import { Card, SimpleGrid, Heading, Box, Text } from "@chakra-ui/react";
import { Link, Router } from "react-router-dom";

const query = gql`
  query Home {
    allPeople {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const HomePage = () => {
  const [data]: UseQueryResponse = useQuery({ query });

  return (
    <Box
      width={"100vw"}
      padding={10}
      display={"flex"}
      flexDirection={"column"}
      gap={10}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Heading>Welcome to Star Wars Database</Heading>

      {data.data ? (
        <SimpleGrid columns={[2, null, 3]} spacing={10} width={"100%"}>
          {data.data.allPeople.edges.map((char: any) => (
            <Link key={char.node.id} to={`/person/:${char.node.id}`}>
              <Card
                height={"100px"}
                cursor={"pointer"}
                display={"flex"}
                textAlign={"center"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text fontSize="xl" textTransform={"uppercase"}>
                  {char.node.name}
                </Text>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      ) : (
        <h2>Loading...</h2>
      )}
    </Box>
  );
};

export default HomePage;
