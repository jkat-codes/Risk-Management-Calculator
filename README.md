# Risk Management Calculator

A desktop application for options traders built with React and Tauri. Designed to help manage risk, calculate position sizes, and track trade performance.

## Features

- **Account Risk Control**: set a maximum risk percentage (default 10%)
- **Position Sizing**: Automatic calculation of contract quantities based on risk tolerance
- **Stop Loss Calculator**: Pre-calculated stop levels at 10%, 15%, 20% and 25% (will be modifiable soon)
- **Risk Tracking**: Monitoring of current account risk

## Trading Calculator

- **Premium-based Calculations**: Input option premium to calculate position metrics
- **Multiple Risk Levels**: Choose from 1%, 2%, 2.5%, 3%, 4%, or 5% account risk per trade
- **Take Profit Targets**: Automatic calculation of T1 (1.25R), T2( 1.5R), T3 (1.75R), and TG4 (2R)
- **Contract Quantity Optimization**: Determines the optimal number of contracts based on risk and premium

## Trade Management

- **Position Sizing**: Van Tharp's Method Used—Risking a specified percentage of portfolio on each trade, prevents losing everything on one trade
- **P&L Calculation**: Automatic profit/loss calculations for each position
- **Break-even Management**: Automatic stop-loss adjustment to break even when profitable
- **Position Closing**: Streamlined closure with confirmation modal

## Account Overview

- **Balance Tracking**: Real-time account balance updates based on positions
- **Risk Exposure**: Visual representation of current risk level
- **Trade History**: Comprehensive log of all current trading activity (historical metrics coming soon)

## Project Structure

- React frontend
- Tauri backend
- Supabase integration (coming soon)

## Tips

- Do not run any tauri build or tauri dev commands from a WSL configuration (it will take forever). Use native OS terminal instead.
