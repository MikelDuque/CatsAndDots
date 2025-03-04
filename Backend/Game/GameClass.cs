namespace Backend.Game;

public class GameClass
{
  public bool IsFirstPlayerMove { get; set; } = true;
  public Player Player1 { get; private set; }
  public Player Player2 { get; private set; }
  public Board Tablero { get; private set; }

  public GameClass(string player1Name, string player2Name , bool isBot = true)
  {
    Player1 = new Player(player1Name);
    Player2 = new Player(player2Name, isBot);
    Tablero = new Board();
  }

  public void PlayTurn(int tipoLinea, int num1, int num2)
  {
    Player currentPlayer = IsFirstPlayerMove ? Player1 : Player2;

    if (currentPlayer.isBot)
    {
      currentPlayer.JugadaBot(Tablero);
    }
    else
    {
      Tablero.Jugada(tipoLinea, num1, num2); 
    }

    if (!Tablero.isBox)
    {
      IsFirstPlayerMove = !IsFirstPlayerMove;
    }
    else
    {
      currentPlayer.Score++;
      if (Tablero.doublePoint) currentPlayer.Score++;
      Tablero.isBox = false;
      Tablero.doublePoint = false;
    }
  }

  public bool IsGameOver()
  {
    return Player1.Score + Player2.Score >= 25;
  }

  public string GetWinner()
  {
    if (Player1.Score > Player2.Score)
      return Player1.Name;
    return Player2.Name;
  }
}
