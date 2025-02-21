namespace Backend.Game;

public class Board
{
  //Atributossss
  private bool[,] hLines = new bool[6, 5];
  private bool[,] vLines = new bool[5, 6];
  public bool isBox = false;
  public bool doublePoint = false;

  //Constructor
  public Board()
  {

  }

  //Metodos
  public void MostrarTablero()
  {
    for (int i = 0; i < hLines.GetLength(0); i++)
    {

      for (int j = 0; j < hLines.GetLength(1); j++)
      {
        if (hLines[i,j] == true)
        {
          Console.Write("*---");
        }
        else
        {
          Console.Write("*   ");
        }

        if (j == 4) { Console.Write("*"); }
      }
      Console.WriteLine("");

      if (i<5)
      {
        for (int k = 0; k < vLines.GetLength(1); k++)
        {
          if (vLines[i,k] == true)
          {
            Console.Write("|   ");
          }
          else
          {
            Console.Write("    ");
          }

        }
      }
      
      Console.WriteLine("");
    }
  }
  
  public void Jugada()
  {
    isBox = false;
    doublePoint = false;

    Console.WriteLine("que linea quieres poner? 1.Horizontal 2.Vertical");
    int resp = int.Parse(Console.ReadLine());
    Console.WriteLine("que linea quieres poner?");
    int num1 = int.Parse(Console.ReadLine());
    int num2 = int.Parse(Console.ReadLine());

    switch (resp) {
      case 1:
        hLines[num1, num2] = true;

        switch (num1)
        {
          case 0:
            if (hLines[num1 + 1, num2] && vLines[num1, num2] && vLines[num1, num2 + 1]) { isBox = true; }
            break;
          case 5:
            if (hLines[num1 - 1, num2] && vLines[num1 - 1, num2] && vLines[num1 - 1, num2 + 1]) { isBox = true; }
            break;
          default:
            if ((hLines[num1 - 1, num2] && vLines[num1 - 1, num2] && vLines[num1 - 1, num2 + 1]) || (hLines[num1 + 1, num2] && vLines[num1, num2] && vLines[num1, num2 + 1])) 
            {
              isBox = true;
              if ((hLines[num1 - 1, num2] && vLines[num1 - 1, num2] && vLines[num1 - 1, num2 + 1]) && (hLines[num1 + 1, num2] && vLines[num1, num2] && vLines[num1, num2 + 1])) { doublePoint = true; }
            }

            break;
        }
        break;

      case 2:
        vLines[num1, num2] = true;

        switch (num2)
        {
          case 0:
            if (vLines[num1, num2 + 1] && hLines[num1, num2] && hLines[num1 + 1, num2]) { isBox = true; }
            break;
          case 5:
            if (vLines[num1, num2 - 1] && hLines[num1, num2 - 1] && hLines[num1 + 1, num2 - 1]) { isBox = true; }
            break;
          default:
            if ((vLines[num1, num2 - 1] && hLines[num1, num2 - 1]) && hLines[num1 + 1, num2 - 1] || (vLines[num1, num2 + 1] && hLines[num1, num2] && hLines[num1 + 1, num2])) 
            { 
              isBox = true;
              if ((vLines[num1, num2 - 1] && hLines[num1, num2 - 1]) && hLines[num1 + 1, num2 - 1] && (vLines[num1, num2 + 1] && hLines[num1, num2] && hLines[num1 + 1, num2])) { doublePoint = true; }
            }
            break;
        }
        break;

      default: 
        Console.WriteLine("numero invalido");
        break;
    }
  }
}
