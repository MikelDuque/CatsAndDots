namespace Backend.Game;

public class GameClass
{
  //Atributos
  private bool firstPlayerMove = true;
  private bool[,] tablero = new bool[6, 6];
  private Player player1;
  private Player player2;

  //metodos
  public GameClass()
  {
    Console.WriteLine("Escribe el nombre del primer jugador");
    string nam1 = Console.ReadLine();

    Console.WriteLine("Escriba el nombre del segundo jugador");
    string nam2 = Console.ReadLine();

    player1 = new Player(nam1);
    player2 = new Player(nam2);

    do
    {
      if (firstPlayerMove == true)
      {
        Console.WriteLine("Es turno de " + player1.Name);
        Jugada();
        firstPlayerMove = false;
      }
      else
      {
        Console.WriteLine("Es turno de " + player2.Name);
        Jugada();
        firstPlayerMove = true;
      }

      MostrarTablero();
    }
    while (true);
  }

  public void MostrarTablero()
  {
    for (int i = 0; i < tablero.GetLength(0); i++)
    {
      for (int j = 0; j < tablero.GetLength(1); j++)
      {
        Console.Write(tablero[i, j] ? "*  " : "-  ");
      }
      Console.WriteLine();
    }
  }

  public void Jugada()
  {
    bool jugadaValida = false;

   
    do
    {
      Console.WriteLine("Escriba su jugada");
      int indice1 = int.Parse(Console.ReadLine());
      int indice2 = int.Parse(Console.ReadLine());
      int indice3 = int.Parse(Console.ReadLine());
      int indice4 = int.Parse(Console.ReadLine());

      if ((indice3 == indice1 + 1 && indice4 == indice2) || (indice3 == indice1 && indice4 == indice2 + 1) || (indice3 == indice1 - 1 && indice4 == indice2) || (indice3 == indice1 && indice4 == indice2 - 1))
      {
        tablero[indice1, indice2] = true;
        tablero[indice3, indice4] = true;
        jugadaValida = true;
      }
      else
      {
        Console.WriteLine("Jugada no valida, los puntos deben ser consecutivos");
      }
    }
    while (jugadaValida == false);
  }
}

//Las entradas de indices cogerlas en una misma "readline" con "[n, n]-[n, n]"
//En una función A aparte separar ese string en valores independientes y comprobar que no se encuentran en el listado de indices ya marcados
//Dentro de esa función A, la comprobación del "if" llamar a otra función B que se encargue de devolver un boolean con las condiciones pertinentes
//Tras ello, si todo ha salido correctamente, la función A llamará a una función C que se encargará de incluir en un listado los índices ya marcados