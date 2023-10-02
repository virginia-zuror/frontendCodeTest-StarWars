import { Box, Button, Card, SkipNavLink, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql, stringifyVariables, useQuery } from "urql";

const PersonPage = () => {
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

  const data = useQuery({ query, variables });
  const [personResult, setPersonResult] = useState<any>();
  const [films, setFilms] = useState<any>([]);
  const [filmInView, setFilmInView] = useState(0);
  const [numberPlanets, setNumberPlanets] = useState<number>(0);

  useEffect(() => {
    setPersonResult(data[0].data?.person);
  }, [data[0].data?.person]);

  useEffect(() => {
    if (personResult) {
      setFilms(personResult.filmConnection.edges);
    }
  }, [personResult?.id]);

  const showNextFilm = () => {
    if (films.length - 1 > filmInView) {
      setFilmInView(filmInView + 1);
    } else if (films.length - 1 === filmInView) {
      null;
    }
  };

  const showPrevtFilm = () => {
    if (filmInView > 0) {
      setFilmInView(filmInView - 1);
    } else if (filmInView === 0) {
      null;
    }
  };

  useEffect(() => {
    setNumberPlanets(0);

    films[filmInView]?.node.planetConnection.edges.map(
      (planet: any) =>
        planet.node.surfaceWater === 0 && setNumberPlanets(numberPlanets + 1)
    );
  }, [filmInView]);

  console.log({ personResult });
  console.log(films);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      padding={20}
    >
      <Link to="/" style={{ position: "fixed", top: 10, left: 10 }}>
        <Text as={'h1'} width={100}>Back to All Characters</Text>
      </Link>
      {personResult ? (
        <Card
          width={500}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={10}
          backgroundColor={"#ad6814"}
        >
          <h1>{personResult.name}</h1>
          <h4>Producers: </h4>

          <h4>Species: {personResult.species?.name || "Human"}</h4>
          {personResult.species && (
            <h4>Average Height: {personResult.species.averageHeight} cm</h4>
          )}
          <h4>Films:</h4>
          <Box
            width={"350px"}
            height={"350px"}
            padding={0}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={2}
            backgroundColor={"#6a4646"}
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
                    textAlign={"center"}
                    fontWeight={400}
                    textTransform={"uppercase"}
                  >
                    {films[filmInView]?.node.title}
                  </Text>
                </Box>
                <Box>
                  Realease date:{" "}
                  <Text>
                    {new Date(
                      films[filmInView]?.node.releaseDate
                    ).toDateString()}
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
              <Button onClick={showPrevtFilm} width={100} background={'#fff'} border={'none'}>
                Prev
              </Button>
              <Button onClick={showNextFilm} width={100} background={'#fff'} border={'none'}>
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
