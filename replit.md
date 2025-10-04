# Laptop Stock Management System

## Overview
A fully static HTML/CSS/JavaScript inventory management system for tracking Dell and Lenovo laptop stock. Designed for GitHub Pages deployment with no backend requirements.

## Features
- Add, edit, and delete laptop entries
- Track brand, model name, specifications, price, and stock quantity
- Generate printable barcodes for each laptop item
- Click barcodes in the table to view detailed item information
- Search and filter inventory
- Local storage persistence (data saved in browser)
- Responsive design for desktop and mobile
- Print barcode labels for physical stocking

## Technology Stack
- Pure HTML5
- CSS3 with gradient styling
- Vanilla JavaScript (no frameworks)
- JsBarcode library (CDN) for barcode generation
- Local Storage API for data persistence

## File Structure
- `index.html` - Main application interface
- `style.css` - All styling and responsive design
- `script.js` - Inventory management logic and barcode generation

## Data Storage
All inventory data is stored in browser's localStorage under key `laptopInventory`. Data persists between sessions on the same browser.

## GitHub Pages Deployment
This is a static site ready for GitHub Pages:
1. Upload all files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Site will be live at `https://username.github.io/repository-name/`

## Recent Changes
- 2025-10-04: Initial creation of stock management system
