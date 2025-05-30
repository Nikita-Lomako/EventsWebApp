using EventsWebApp.Core.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventsWebApp.Core.IRepositories
{
    public interface IAuthRepository
    {
        bool IsUniqueUser(string username);
        Task<LoginResponseDTO?> Login(LoginRequestDTO loginRequestDTO);
        Task<UserDto?> Register(RegistrationRequestDto requestDTO);
    }
}
