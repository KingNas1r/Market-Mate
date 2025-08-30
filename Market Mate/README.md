# SmartStock Inventory Management System

A modern, full-stack inventory management application designed specifically for Nigerian small businesses. Features voice input support for local languages and Nigerian Naira currency integration.

## Features

### Core Functionality
- **Product Management**: Add, edit, delete, and track inventory with low-stock alerts
- **Sales Processing**: Record transactions with automatic stock updates
- **Dashboard Analytics**: Real-time business metrics and sales insights
- **Transaction History**: Complete sales records with filtering capabilities

### Nigerian Market Features
- **Multi-language Voice Input**: Supports English, Yoruba, and Nigerian Pidgin
- **Nigerian Naira (₦)**: All currency displays use local currency symbol
- **Local Business Focus**: Designed for Nigerian small business workflows

### Technical Features
- **Persistent Database**: PostgreSQL with Drizzle ORM for reliable data storage
- **Modern UI**: Responsive design with shadcn/ui component library
- **Real-time Updates**: Live data synchronization across the application
- **Voice Recognition**: Optional voice input for accessibility and ease of use

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for state management
- shadcn/ui components
- Tailwind CSS for styling
- Web Speech API for voice input

### Backend
- Express.js with TypeScript
- Drizzle ORM for database operations
- PostgreSQL database
- RESTful API design

### Development
- Vite for build tooling
- ESBuild for server bundling
- TypeScript throughout the stack

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Modern web browser with microphone support

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd smartstock-inventory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy and configure your database URL
export DATABASE_URL="your-postgresql-connection-string"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### Adding Products
1. Navigate to the Inventory page
2. Click "Add Product" 
3. Fill in product details manually or use voice input
4. Optional: Use the voice feature by selecting your language and clicking "Speak"

### Recording Sales
1. Go to the Sales page
2. Click "New Sale"
3. Select product, quantity, and payment method
4. Optional: Add voice notes about the transaction

### Voice Input
- Supports English (Nigerian), Yoruba, and Pidgin
- Click the "Speak" button and select your preferred language
- Voice input is completely optional - you can always type instead

## Database Schema

### Products Table
- id, name, description, category
- price (in Nigerian Naira), stock, lowStockThreshold
- createdAt, updatedAt timestamps

### Sales Table
- id, productId (foreign key), quantity
- unitPrice, totalAmount, paymentMethod
- notes, createdAt timestamp

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for Nigerian small businesses