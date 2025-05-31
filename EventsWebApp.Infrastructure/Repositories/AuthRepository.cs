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
        private readonly string _secretKey;

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
            return user == null;
        }

        public async Task<LoginResponseDTO?> Login(LoginRequestDTO loginRequestDTO)
        {
            var user = await _db.AppUsers.SingleOrDefaultAsync(
                x => x.UserName == loginRequestDTO.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password))
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.UserName ?? string.Empty)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return new LoginResponseDTO
            {
                User = _mapper.Map<UserDto>(user),
                Token = tokenHandler.WriteToken(token)
            };
        }

        public async Task<UserDto?> Register(RegistrationRequestDto requestDTO)
        {
            AppUser userobj = new()
            {
                UserName = requestDTO.Email,
                Email = requestDTO.Email,
                NormalizedEmail = requestDTO.Email.ToUpper(),
                NormalizedUserName = requestDTO.Email.ToUpper()
            };

            if (await _userManager.FindByEmailAsync(requestDTO.Email) != null)
            {
                return null;
            }

            var result = await _userManager.CreateAsync(userobj, requestDTO.Password);

            if (!result.Succeeded)
            {
                return null;
            }

            // Create roles if they don't exist
            if (!await _roleManager.RoleExistsAsync("admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("admin"));
                await _roleManager.CreateAsync(new IdentityRole("user"));
            }
            await _userManager.AddToRoleAsync(userobj, "admin");

            var user = _db.AppUsers.FirstOrDefault(u => u.UserName == requestDTO.Email);
            return user != null ? _mapper.Map<UserDto>(user) : null;
        }
    }
}
