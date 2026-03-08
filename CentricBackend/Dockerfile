# Usamos la versión 10.0 que es la que pide tu proyecto
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["CentricBackend.csproj", "."]
RUN dotnet restore "./CentricBackend.csproj"
COPY . .
RUN dotnet build "CentricBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CentricBackend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CentricBackend.dll"]