using Backend.DTOs;
using Backend.Models;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterRequest request);
        Task<string> LoginAsync(LoginRequest request);
    }
}
