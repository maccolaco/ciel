# Ciel Portfolio Manager

A professional desktop portfolio risk management application built for hedge funds and research funds.

## Features

- **Portfolio Upload**: Import portfolio data via CSV/Excel files
- **Live Market Data**: Real-time stock prices and market data
- **Risk Analytics**: Comprehensive risk metrics including beta, concentration, and sector analysis
- **Interactive Charts**: Visual portfolio analysis with sector allocation, performance tracking
- **Desktop Application**: Native Windows and Mac application using Tauri

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Desktop Framework**: Tauri (Rust)
- **Charts**: Recharts
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Radix UI
- **Build Tool**: Vite

## Development

### Prerequisites

- Node.js 18+
- Rust (for Tauri)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Install Tauri CLI:
```bash
npm install -g @tauri-apps/cli
```

3. Run in development mode:
```bash
npm run tauri:dev
```

### Building

Build for production:
```bash
npm run tauri:build
```

## Usage

1. **Upload Portfolio**: Start by uploading a CSV file with your portfolio data
   - Required columns: Symbol, Quantity, Avg Cost
   - Optional: Name, Sector

2. **View Analytics**: Navigate through different tabs to analyze your portfolio:
   - Overview: Summary metrics and charts
   - Holdings: Detailed table view with live prices
   - Analytics: Advanced charts and visualizations
   - Risk: Risk metrics and analysis

3. **Live Data**: The application fetches real-time market data to keep your portfolio updated

## CSV Format

Your portfolio CSV should include these columns:

```csv
Symbol,Quantity,Avg Cost,Name,Sector
AAPL,100,150.00,Apple Inc,Technology
MSFT,50,280.00,Microsoft Corp,Technology
GOOGL,25,2500.00,Alphabet Inc,Technology
```

## API Configuration

The application uses Alpha Vantage API for market data. To use live data:

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Update the API_KEY in `lib/api.ts`

## License

MIT License