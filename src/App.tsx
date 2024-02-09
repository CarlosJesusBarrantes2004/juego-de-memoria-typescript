import { useEffect, useState } from "react";
import { Plantilla, Carta } from "./types/types";
import { datos } from "./data/Datos";

const reyIncognito = "https://www.html6.es/img/rey_incognito.png";

function App() {
  const [cartas, setCartas] = useState<Plantilla>([]);
  const [cartasJugadas, setCartasJugadas] = useState<Carta[]>([]);
  const [finJuego, setFinJuego] = useState(false);

  const fisherYates = (array: Carta[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const array: Carta[] = datos.map((img) => ({
      img,
      visible: false,
    }));
    const arrayAleatorio = fisherYates([...array, ...array]);
    setCartas(arrayAleatorio);
  }, []);

  const ganaste = (): boolean => cartas.every((carta) => carta.visible);

  const jugar = (index: number) => {
    if (!cartas || cartasJugadas.length >= 2 || cartas[index].visible === true)
      return;

    if (cartasJugadas.length === 0) {
      setCartas((cartas) =>
        cartas?.map((carta, i) => {
          if (index === i) return { ...carta, visible: true };
          else return carta;
        })
      );
      setCartasJugadas([cartas[index]]);
    } else if (cartasJugadas.length === 1) {
      setCartas((cartas) =>
        cartas.map((carta, i) => {
          if (index === i) {
            return { ...carta, visible: true };
          } else return carta;
        })
      );
      setCartasJugadas([...cartasJugadas, cartas[index]]);
      if (cartasJugadas[0].img !== cartas[index].img) {
        setTimeout(() => {
          setCartas((cartas) =>
            cartas.map((carta, i) => {
              if (cartasJugadas[0].img === carta.img || i === index) {
                return { ...carta, visible: false };
              } else return carta;
            })
          );
          setCartasJugadas([]);
        }, 2000);
      } else {
        setCartasJugadas([]);
      }
    }
  };

  useEffect(() => {
    if (cartas.length > 0 && ganaste()) {
      setFinJuego(true);
    }
  }, [cartas]);

  return (
    <>
      <div className="contenedor">
        <div className="juego">
          <h1 className="juego__titulo">Juego de memoria</h1>
          <div className="juego__plantilla">
            {cartas &&
              cartas.map((carta, i) => (
                <div className="carta" key={i} onClick={() => jugar(i)}>
                  <img
                    src={carta.visible ? carta.img : reyIncognito}
                    className="carta__img"
                  />
                </div>
              ))}
          </div>
          {finJuego && (
            <p className="text-red-500 font-bold text-lg text-center mt-4">
              Felicidades, completaste el juego!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
