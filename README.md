# Online Store - Single Product Website

A modern single product landing page built with Next.js 14 and React, inspired by e-commerce product pages.

## Features

- ✨ Modern, responsive design
- ⏰ Live countdown timer for limited offers
- 🛒 Product showcase with pricing
- 📝 Order form with quantity selector
- ⭐ Customer reviews section
- 📱 Mobile-friendly interface
- 💳 Cash on delivery payment option

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Package Manager:** npm

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
online_store/
├── app/
│   ├── components/
│   │   ├── CountdownTimer.tsx
│   │   ├── CountdownTimer.module.css
│   │   ├── OrderForm.tsx
│   │   └── OrderForm.module.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.module.css
│   └── globals.css
├── public/
│   └── product-image.jpg (add your product image here)
├── package.json
├── next.config.js
└── tsconfig.json
```

## Customization

### Update Product Information

Edit `app/page.tsx` to change:
- Product name
- Product price
- Features list
- Customer reviews

### Add Product Images

Place your product images in the `public` folder and reference them in the components.

### Modify Styles

Update the CSS modules in each component folder to customize colors, fonts, and layouts.

## Building for Production

```bash
npm run build
npm start
```

## License

All Rights Reserved © 2026
