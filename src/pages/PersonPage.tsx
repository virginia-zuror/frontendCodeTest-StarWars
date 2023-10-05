import { Box, Button, Card, Text } from "@chakra-ui/react";
import pl from "date-fns/esm/locale/pl/index.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UseQueryResponse, gql, stringifyVariables, useQuery } from "urql";

const PersonPage = () => {
  const id = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const query = gql`
    query currentPerson($personId: ID) {
      person(id: $personId) {
        id
        name
        birthYear
        eyeColor
        species {
          averageHeight
          name
          id
        }
        filmConnection {
          films {
            id
            planetConnection {
              planets {
                id
                name
                surfaceWater
              }
            }
            producers
            releaseDate
            title
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
          }
        }
      }
    }
  `;

  const variables = {
    personId: stringifyVariables(id),
  };

  const [film, setFilm] = useState<any>([]);
  const data: UseQueryResponse = useQuery({ query, variables });
  const [personResult, setPersonResult] = useState<any>();
  const [numberPlanets, setNumberPlanets] = useState<number>(0);
  const [totalCount, setTotalCount] = useState(0);
  const [producers, setProducers] = useState([]);
  const [producersCounter, setProducersCounter] = useState<Object>({String: Number});

  useEffect(() => {
    setPersonResult(data[0].data?.person);
  }, [data[0].data?.person]);

  useEffect(() => {
    setTotalCount(personResult?.filmConnection?.totalCount);
  }, [personResult?.id]);

  useEffect(() => {
    setFilm(personResult?.filmConnection?.films[currentPage - 1]);
  }, [personResult?.id, currentPage]);

  useEffect(() => {
    setNumberPlanets(0);

    let planetsWithoutWater = 0;
    film.planetConnection?.planets.map((planet: any) => {
      if (planet.surfaceWater === 0) {
        planetsWithoutWater++;
      }
    });

    setNumberPlanets(planetsWithoutWater);
  }, [film?.planetConnection, currentPage]);

  const producersList = () => {

    let producersArray: String[] = [];
    personResult?.filmConnection?.films.map((film: any) => {
      film.producers.map((producer: String) => {
        producersArray.push(producer);
      });
    });

    setProducersCounter(
      producersArray.reduce((countProducer, producerName:String) => {
        countProducer[producerName] = (countProducer[producerName] || 0) + 1;
        return countProducer;
      }, {})
    );
  };

  useEffect(() => {
    producersList();
  }, [personResult?.id]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      padding={20}
    >
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "#ECECEC",
          borderRadius: "4px",
        }}
      >
        <Text as={"h1"} width={100} fontSize={"l"} textAlign={"center"}>
          Back to All Characters
        </Text>
      </Link>
      {personResult ? (
        <Card
          className="card"
          width={500}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={10}
        >
          <Text fontWeight={600} textTransform={"uppercase"}>
            {personResult.name}
          </Text>
          <Box width={'100%'}>
            <Text fontWeight={500} >Producers: </Text>

            {Object.entries(producersCounter).map(([name, value]) => (
              <Text key={name}>
                {name}: {value} {value===1 ? 'time' : 'times'}.
              </Text>
            ))}
          

          <Text fontWeight={500} mt={2}>Species: {personResult.species?.name || "Human"}</Text>
          {personResult.species && (
            <Text fontWeight={500}>Average Height: {personResult.species.averageHeight} cm</Text>
          )}
          </Box>
          <Text fontWeight={600}>Films:</Text>
          <Box
            width={"350px"}
            height={"360px"}
            padding={2}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={2}
            border={"2px solid #6a4646"}
            borderRadius={"4px"}
          >
            <Box width={"350px"} height={"300px"} display={"flex"}>
              <Box
                width={"350px"}
                height={"250px"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"left"}
                justifyContent={"space-evenly"}
                paddingLeft={2}
                gap={2}
                color={"#fff"}
              >
                <Box width={"100%"}>
                  <Text
                    position={"relative"}
                    top={"-15px"}
                    textAlign={"center"}
                    fontWeight={500}
                    textTransform={"uppercase"}
                  >
                    {film?.title}
                  </Text>
                </Box>
                <Box display={"flex"} gap={3}>
                  Realease date:{" "}
                  <Text fontWeight={400}>
                    {new Date(film?.releaseDate).toDateString()}
                  </Text>
                </Box>
                <Box>
                  Planets without water: {numberPlanets}{" "}
                  {/* {films[filmInView]?.node.planetConnection.edges.map((planet:any)=> planet.node.surfaceWater === 0 && <Text key={planet.node.id}>{planet.node.name}</Text>)} */}
                </Box>
              </Box>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
              padding={10}
            >
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                isDisabled={currentPage === 1}
                width={100}
                sx={{ backgroundColor: "#E5C160" }}
              >
                Prev
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                isDisabled={totalCount === currentPage}
                width={100}
                sx={{ backgroundColor: "#E5C160" }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Card>
      ) : (
        <h1>Loading...</h1>
      )}
    </Box>
  );
};

export default PersonPage;
