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
  

  public void Jugada(int tipoLinea, int num1, int num2)
  {
    isBox = false;
    doublePoint = false;

    if (tipoLinea == 1) 
    {
      AgregarLineaHorizontal(num1, num2);
    }
    else if (tipoLinea == 2) 
    {
      AgregarLineaVertical(num1, num2);
    }
  }

  public bool ExisteLineaHorizontal(int fila, int columna)
  {
    return hLines[fila, columna];
  }

  public bool ExisteLineaVertical(int fila, int columna)
  {
    return vLines[fila, columna];
  }

  public void AgregarLineaHorizontal(int num1, int num2)
  {
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
  }

  public void AgregarLineaVertical(int num1, int num2)
  {
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
  }

}
