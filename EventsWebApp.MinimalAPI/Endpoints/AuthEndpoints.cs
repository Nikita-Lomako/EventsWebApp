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
                .Accepts<RegistrationRequestDTO>("application/json")
                .Produces<APIResponse>(StatusCodes.Status200OK)
                .Produces<APIResponse>(StatusCodes.Status400BadRequest);
        }

        private async static Task<IResult> Login(IAuthRepository _authRepo,
            [FromBody] LoginRequestDTO model)
        {
            APIResponse response = new() { IsSuccess = false, StatusCode = HttpStatusCode.BadRequest };

            var loginResponse = await _authRepo.Login(model);
            if (loginResponse == null)
            {
                response.ErrorMessages.Add("Username or password is incorrect");
                return Results.BadRequest(response);
            }
            response.Result = loginResponse;
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;

            return Results.Ok(response);
        }

        private async static Task<IResult> Register(IAuthRepository _authRepo,
           [FromBody] RegistrationRequestDTO model)
        {
            APIResponse response = new() { IsSuccess = false, StatusCode = HttpStatusCode.BadRequest };

            bool iFUsernameIsUnique = _authRepo.IsUniqueUser(model.UserName);
            if (!iFUsernameIsUnique)
            {
                response.ErrorMessages.Add("Username already exists");
                return Results.BadRequest(response);
            }
            var registerResponse = await _authRepo.Register(model);
            if (registerResponse == null || string.IsNullOrEmpty(registerResponse.UserName))
            {
                response.ErrorMessages.Add("Registration failed. Please check provided information.");
                return Results.BadRequest(response);
            }

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;

            return Results.Ok(response);
        }
    }
}
