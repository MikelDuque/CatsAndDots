namespace Backend.Game;

public class Player
{
  public string Name { get; set; }
  public int Score { get; set; }
  public bool isBot { get; set; } 
  private Random rand = new Random();

  public Player(string name, bool isBot = false)
  {
    Name = name;
    this.isBot = isBot;
  }

  public void MostrarPuntuacion()
  {
    Console.WriteLine("Puntuación de " + Name + " : " + Score);
  }

  public void JugadaBot(Board tablero)
  {
    if (!isBot) return; 

    int tipoLinea, fila, columna;
    bool lineaValida = false;

    do
    {
      tipoLinea = rand.Next(1, 3); 
      

      if (tipoLinea == 1 )
      {
        fila = rand.Next(0, 6);
        columna = rand.Next(0, 5);
        if (!tablero.ExisteLineaHorizontal(fila, columna))
        {
          tablero.AgregarLineaHorizontal(fila, columna);
          lineaValida = true;
        }
        
      }
      else if (tipoLinea == 2 )
      {
        fila = rand.Next(0, 5);
        columna = rand.Next(0, 6);

        if (!tablero.ExisteLineaVertical(fila, columna))
        {
          tablero.AgregarLineaVertical(fila, columna);
          lineaValida = true;
        }
        
      }
    } while (!lineaValida);
  }
}
