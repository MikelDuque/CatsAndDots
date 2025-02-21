namespace Backend.Game;

public class GameClass
{
  //Atributos
  private bool firstPlayerMove = true;
  private Player player1;
  private Player player2;
  private Board tablero;

  //metodos
  public GameClass()
  {
    Console.WriteLine("Escribe el nombre del primer jugador");
    string nam1 = Console.ReadLine();

    Console.WriteLine("Escriba el nombre del segundo jugador");
    string nam2 = Console.ReadLine();

    player1 = new Player(nam1);
    player2 = new Player(nam2);
    tablero = new Board();

    do
    {
      if (firstPlayerMove == true)
      {
        Console.WriteLine("Es turno de " + player1.Name);
      }
      else
      {
        Console.WriteLine("Es turno de " + player2.Name);
      }

      tablero.Jugada();
      tablero.MostrarTablero();

      if (tablero.isBox == false)
      {
        firstPlayerMove = !firstPlayerMove;
      }
      else
      {
        if (firstPlayerMove)
        {
          player1.Score++;
          if (tablero.doublePoint)
          {
            player1.Score++;
          }
        }
        else
        {
          player2.Score++;
          if (tablero.doublePoint)
          {
            player2.Score++;
          }
        }
      }

      player1.MostrarPuntuacion();
      player2.MostrarPuntuacion();

    } while (player1.Score+player2.Score < 25);

    if (player1.Score<player2.Score)
    {
      Console.WriteLine(player2.Name+" gana la partida");
    }
    else
    {
      Console.WriteLine(player1.Name + " gana la partida");
    }

  }
}

//Las entradas de indices cogerlas en una misma "readline" con "[n, n]-[n, n]"
//En una función A aparte separar ese string en valores independientes y comprobar que no se encuentran en el listado de indices ya marcados
//Dentro de esa función A, la comprobación del "if" llamar a otra función B que se encargue de devolver un boolean con las condiciones pertinentes
//Tras ello, si todo ha salido correctamente, la función A llamará a una función C que se encargará de incluir en un listado los índices ya marcados