# iNat Life List

A web app that displays a checklist of the top species observed in a given location on iNaturalist, cross-referenced against a specific user's observations.

## Project Overview

This project consists of:
- **Frontend**: React + TypeScript app built with Vite.
- **Backend**: .NET 8 Web API serving data to the frontend.

The goal is to help users track which species they have already observed and which they still need to find.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: .NET 8 Web API
- **Hosting**:
  - Frontend: [Vercel](https://vercel.com/)
  - Backend: [Render](https://render.com/)

## Development

### Prerequisites
- Node.js 18+ (for frontend)
- .NET 9 SDK (for backend)

### Running the Frontend

```bash
cd src/web/inat-lift-list
yarn
yarn dev
```

### Running the API
```bash
cd src/api/iNatLifeList.Api
dotnet run
```

## Deployment

* Frontend: Vercel
* Backend: Render

(Details coming soon)

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details. 