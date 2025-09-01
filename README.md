# akar-quotation-client

Frontend for Akar Fourwheel Quotation Platform

## Overview

This repository contains the client-side application for the Akar Fourwheel Quotation platform. It provides the user interface for interacting with quotations, browsing data, and performing client-side operations.

## Features

- Modern web UI for managing quotations
- Responsive and user-friendly design
- Connects to the backend API for data operations

## Tech Stack

- **Language:** JavaScript
- **Framework/Build Tool:** ( React )
- **Other:** Uses Vite for build, ESLint for linting

## Project Structure

```
/
├── public/           # Static assets
├── src/              # Source code (components, pages, etc.)
├── carScheme.json    # Car scheme data
├── salesPerson.json  # Salesperson data
├── index.html        # Main HTML template
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── eslint.config.js  # Linting rules
├── vite.config.js    # Vite configuration
├── vercel.json       # Vercel deployment config
├── .gitignore        # Git ignored files
├── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm

### Installation

```bash
git clone https://github.com/akar-fourwheel/akar-quotation-client.git
cd akar-quotation-client
npm install
```

### Running the App

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```
build needs to be uploaded to the 'quotations' folder in cPanel. 

## Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## main branch
- contains code for v1.
## stag branch
- contains the currently deployed code v2.

### Links

- [Repository](https://github.com/akar-fourwheel/akar-quotation-client)
