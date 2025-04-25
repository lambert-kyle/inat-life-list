using Microsoft.AspNetCore.Mvc;

namespace iNatLifeList.Api.Infrastructure.Controllers;

[ApiController]
[Route("[controller]")]
[Route("api/[controller]")]
public class HealthController
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        return new OkObjectResult(new{Status = "Healthy"});
    }
}