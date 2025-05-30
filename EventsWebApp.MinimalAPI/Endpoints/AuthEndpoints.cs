using EventsWebApp.Core.Dtos;
using EventsWebApp.Core.IRepositories;
using EventsWebApp.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EventsWebApp.MinimalAPI.Endpoints
{
    public static class AuthEndpoints
    {
        public static void ConfigureAuthEndpoints(this WebApplication app)
        {
            // Login
            app.MapPost("/api/login", Login)
                .WithName("Login")
                .Accepts<LoginRequestDTO>("application/json")
                .Produces<APIResponse>(StatusCodes.Status200OK)
                .Produces<APIResponse>(StatusCodes.Status400BadRequest);
            // Register
            app.MapPost("/api/register", Register)
                .WithName("Register")
                .Accepts<RegistrationRequestDto>("application/json")
                .Produces<APIResponse>(StatusCodes.Status200OK)
                .Produces<APIResponse>(StatusCodes.Status400BadRequest);
        }

        private static async Task<IResult> Login(
            IAuthRepository _authRepo,
            [FromBody] LoginRequestDTO model)
        {
            if (model == null)
            {
                return Results.BadRequest(new APIResponse 
                { 
                    IsSuccess = false, 
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    ErrorMessages = new List<string> { "Invalid request data" }
                });
            }

            var loginResponse = await _authRepo.Login(model);
            if (loginResponse == null)
            {
                return Results.BadRequest(new APIResponse 
                { 
                    IsSuccess = false, 
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    ErrorMessages = new List<string> { "Username or password is incorrect" }
                });
            }

            return Results.Ok(new APIResponse 
            { 
                IsSuccess = true, 
                StatusCode = (int)HttpStatusCode.OK,
                Result = loginResponse
            });
        }

        private static async Task<IResult> Register(
            IAuthRepository _authRepo,
            [FromBody] RegistrationRequestDto model)
        {
            if (model == null)
            {
                return Results.BadRequest(new APIResponse 
                { 
                    IsSuccess = false, 
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    ErrorMessages = new List<string> { "Invalid request data" }
                });
            }

            if (!_authRepo.IsUniqueUser(model.Email))
            {
                return Results.BadRequest(new APIResponse 
                { 
                    IsSuccess = false, 
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    ErrorMessages = new List<string> { "Username already exists" }
                });
            }

            var registerResponse = await _authRepo.Register(model);
            if (registerResponse == null)
            {
                return Results.BadRequest(new APIResponse 
                { 
                    IsSuccess = false, 
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    ErrorMessages = new List<string> { "Registration failed. Please check provided information." }
                });
            }

            return Results.Ok(new APIResponse 
            { 
                IsSuccess = true, 
                StatusCode = (int)HttpStatusCode.OK,
                Result = registerResponse
            });
        }
    }
}
