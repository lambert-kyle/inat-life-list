# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything and restore dependencies
COPY . ./
RUN dotnet restore

# Build and publish the app
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/out .

# Expose port (optional but good practice)
EXPOSE 8080

# Set environment variable for ASP.NET to bind to correct port
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "iNatLifeList.Api.dll"]
