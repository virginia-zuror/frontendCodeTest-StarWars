

import { UseQueryResponse, UseQueryState, gql, useQuery } from "urql";
import { Card, SimpleGrid, Heading, Box, Text } from '@chakra-ui/react'
import { Fragment } from "react";

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


  

  return <Box width={'100vw'} padding={10} display={"flex"} flexDirection={"column"} gap={10} alignItems={'center'} justifyContent={"center"}> 
    <Heading >Welcome to Star Wars Database</Heading>
    
    {data.data ? <SimpleGrid columns={[2, null, 3]} spacing={10} width={'100%'}>{data.data.allPeople.edges.map((char:any)=>
    (<Card key={char.node.id} height={'100px'} cursor={'pointer'} display={"flex"} textAlign={"center"} justifyContent={"center"} alignItems={"center"} onClick={()=>console.log(char.node.name)}>
      <Text fontSize='xl' textTransform={'uppercase'}>{char.node.name}</Text>

    </Card>))}</SimpleGrid>: 
    <h2>Loading...</h2> }
    
   
    
    </Box>;
};

export default HomePage;
