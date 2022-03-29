FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TODSS-HydroLogic-Neerslagradar/TODSS-HydroLogic-Neerslagradar.csproj", "TODSS-HydroLogic-Neerslagradar/"]
RUN dotnet restore "TODSS-HydroLogic-Neerslagradar/TODSS-HydroLogic-Neerslagradar.csproj"
COPY . .
WORKDIR "/src/TODSS-HydroLogic-Neerslagradar"
RUN dotnet build "TODSS-HydroLogic-Neerslagradar.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TODSS-HydroLogic-Neerslagradar.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TODSS-HydroLogic-Neerslagradar.dll"]
