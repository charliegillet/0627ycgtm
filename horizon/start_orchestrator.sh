#!/bin/bash

# Horizon Orchestrator Quick Start Script
# Sets up environment and runs the orchestrator

echo "🐝 Starting Horizon Orchestrator..."
echo ""

# API keys and CONVEX_URL are loaded from .env by the orchestrator (dotenv).
# Make sure the project .env has BROWSER_USE_API_KEY, OPENAI_API_KEY, and CONVEX_URL.

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "   Please run: python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Run the orchestrator
.venv/bin/python orchestrator.py
