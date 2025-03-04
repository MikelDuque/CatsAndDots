namespace Backend.TerminalGame
  ;

public class Game
{
  private bool firstPlayerMove = true;
  private Player player1;
  private Player player2;
  private Board tablero;

  public Game()
  {
    Console.WriteLine("Escribe el nombre del primer jugador:");
    string nam1 = Console.ReadLine();

    Console.WriteLine("¿Quieres jugar contra un bot? (s/n)");
    string response = Console.ReadLine().ToLower();

    if (response == "s")
    {
      player1 = new Player(nam1);
      player2 = new Player("Bot", true);
    }
    else
    {
      Console.WriteLine("Escribe el nombre del segundo jugador:");
      string nam2 = Console.ReadLine();
      player1 = new Player(nam1);
      player2 = new Player(nam2);
    }

    tablero = new Board();

    do
    {
      Player currentPlayer = firstPlayerMove ? player1 : player2;
      Console.WriteLine("Es turno de " + currentPlayer.Name);

      if (currentPlayer.isBot)
      {
        currentPlayer.JugadaBot(tablero);
      }
      else
      {
        tablero.Jugada();
      }

      tablero.MostrarTablero();

      if (!tablero.isBox)
      {
        firstPlayerMove = !firstPlayerMove;
      }
      else
      {
        currentPlayer.Score++;
        if (tablero.doublePoint) currentPlayer.Score++;
        tablero.isBox = false;
        tablero.doublePoint = false;
      }

      player1.MostrarPuntuacion();
      player2.MostrarPuntuacion();

    } while (player1.Score + player2.Score < 25);

    if (player1.Score < player2.Score)
    {
      Console.WriteLine(player2.Name + " gana la partida");
    }
    else
    {
      Console.WriteLine(player1.Name + " gana la partida");
    }
  }
}