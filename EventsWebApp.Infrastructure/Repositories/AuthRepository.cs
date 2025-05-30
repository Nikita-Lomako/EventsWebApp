using AutoMapper;
using EventsWebApp.Core.Dtos;
using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using EventsWebApp.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EventsWebApp.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private string _secretKey;

        public AuthRepository(AppDbContext db, IMapper mapper, IConfiguration configuration,
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _configuration = configuration;
            _mapper = mapper;
            _userManager = userManager;
            _roleManager = roleManager;
            _secretKey = configuration.GetSection("Jwt:Key").Value
    ?? throw new ArgumentNullException("Secret key is missing");
        }

        public bool IsUniqueUser(string username)
        {
            var user = _db.AppUsers.FirstOrDefault(x => x.UserName == username);

            if (user == null)
                return true;

            return false;
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO)
        {
            var user = await _db.AppUsers.SingleOrDefaultAsync(
                x => x.UserName == loginRequestDTO.UserName);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password))
                return null; // Пользователь не найден

            var roles = await _userManager.GetRolesAsync(user);

            // ⬇️ Формируем список клеймов (claims)
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName)
    };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Создание JWT-токена
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            // Описание токена
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Утверждения (claims) о пользователе
                Subject = new ClaimsIdentity(claims),
                // Срок действия токена (7 дней)
                Expires = DateTime.UtcNow.AddDays(7),
                // Креденциалы для подписи
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };
            // Генерация токена
            var token = tokenHandler.CreateToken(tokenDescriptor);
            // Формирование ответа
            return new LoginResponseDTO
            {
                User = _mapper.Map<UserDTO>(user), // Информация о пользователе
                Token = tokenHandler.WriteToken(token) // Преобразование в строку формата JWT
            };
        }

        public async Task<UserDTO> Register(RegistrationRequestDTO requestDTO)
        {
            AppUser userobj = new()
            {
                UserName = requestDTO.UserName,
                Name = requestDTO.Name,
                NormalizedEmail = requestDTO.UserName.ToUpper(),
                Email = requestDTO.UserName,
            };
            // Проверка, существует ли пользователь
            if (await _userManager.FindByNameAsync(requestDTO.UserName) != null)
            {
                return null; // Username not unique
            }

            var result = await _userManager.CreateAsync(userobj, requestDTO.Password);

            if (!result.Succeeded)
            {
                return null; // Creation failed
            }

            // Создание ролей при необходимости
            if (!await _roleManager.RoleExistsAsync("admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("admin"));
                await _roleManager.CreateAsync(new IdentityRole("customer"));
            }
            await _userManager.AddToRoleAsync(userobj, "admin");

            var user = _db.AppUsers.FirstOrDefault(u => u.UserName == requestDTO.UserName);
            return _mapper.Map<UserDTO>(user);
        }
    }
}
