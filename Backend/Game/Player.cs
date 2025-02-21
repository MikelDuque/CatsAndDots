namespace Backend.Game;

public class Player
{
  //Atributos
  public string Name { get; set; }
  public int Score { get; set; }


  //Constructor
  public Player(string name)
  {
    Name= name;
  }

  //Metodos
  public void MostrarPuntuacion()
  {
    Console.WriteLine("Puntuacion de " + Name + " : " + Score);
  }
}
