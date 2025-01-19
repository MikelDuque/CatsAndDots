using Backend.Models.Database.Repositories;

namespace Backend.Models.Database;

public class UnitOfWork
{
  private readonly DataContext _dataContext;

  private UserRepository _userRepository = null!;


  public UserRepository UserRepository => _userRepository ??= new UserRepository(_dataContext);


  public UnitOfWork(DataContext dataContext)
  {
    _dataContext = dataContext;
  }

  public async Task<bool> SaveAsync()
  {
    return await _dataContext.SaveChangesAsync() > 0;
  }
}
