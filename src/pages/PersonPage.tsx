import { Box, Card } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  gql, stringifyVariables, useQuery } from "urql";

const PersonPage = () => {
  /* const client = createClient({
    url: 'https://swapi-graphql.netlify.app/.netlify/functions/index', 
  }); */


  const id = useParams();
  const query = gql`
    query currentPerson($personId: ID) {
      person(id: $personId) {
        id
        name
        birthYear
        eyeColor
        filmConnection {
          edges {
            node {
              producers
              id
              releaseDate
              title
              planetConnection {
                edges {
                  node {
                    id
                    name
                    surfaceWater
                  }
                }
              }
            }
          }
        }
        species {
          averageHeight
          name
          id
        }
      
      }
      
    }
   
  `;
  const variables = {
    personId: stringifyVariables(id),
  };

 /* good?
   client.query(query, variables).toPromise().then((result) => {
  console.log(result.data); // Aquí puedes acceder a los datos de la respuesta
});  */

  const data = useQuery( {query, variables} );
  const [personResult, setPersonResult] = useState<any>()

  useEffect(() => {
    setPersonResult(data[0].data?.person)
  
   
  }, [data[0].data?.person])
  


  console.log({personResult});
  

  return <Box>{
    personResult ? <Card>
<h1>{personResult.name}</h1>
<h4>Producers: </h4>
<h4>Species: {personResult.species?.name || "Human"}</h4>
{personResult.species && <h4>Average Height: {personResult.species.averageHeight}</h4>}
<h4>Films:</h4>
{/* films...etc */}
    </Card>: <h1>Loading...</h1>
    }</Box>;
};

export default PersonPage;
