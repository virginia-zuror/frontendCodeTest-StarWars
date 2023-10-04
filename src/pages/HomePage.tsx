import { UseQueryResponse, gql, useQuery } from "urql";
import { Card, SimpleGrid, Heading, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

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
      <Heading color={'#ECECEC'} mt={10}>Welcome to Star Wars Database</Heading>

      {data.data ? (
        <SimpleGrid columns={[2, 3, 4]} spacing={10} width={"100%"} padding={10}>
          {data.data.allPeople.edges.map((char: any) => (
            <Link key={char.node.id} to={`/person/${char.node.id}`}>
              <Card
              className="card"
                height={"150px"}
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
