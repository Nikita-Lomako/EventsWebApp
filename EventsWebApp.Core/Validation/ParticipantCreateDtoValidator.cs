using EventsWebApp.Core.Dtos;
using FluentValidation;

namespace EventsWebApp.Core.Validation
{
    public class ParticipantCreateDtoValidator : AbstractValidator<ParticipantCreateDto>
    {
        public ParticipantCreateDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Surname)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .LessThan(DateTime.Now.AddYears(-16))
                .WithMessage("Participant must be at least 16 years old");

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(100);

            RuleFor(x => x.EventId)
                .NotEmpty()
                .GreaterThan(0);
        }
    }
} 