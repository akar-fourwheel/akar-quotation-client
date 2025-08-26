# Dashboard Components

This directory contains reusable dashboard components for the car dealership management frontend.

## Components Overview

### Core Components

- **DashboardCard**: Reusable card container with loading and error states
- **KPICard**: Key Performance Indicator cards with trend indicators
- **ActivityFeed**: Displays recent activities and updates
- **DateRangePicker**: Date range selection with presets
- **DashboardLayout**: Consistent layout structure for dashboard pages
- **SimpleChart**: Lightweight chart components without external libraries

### Chart Components

All chart components are built with pure CSS and SVG for minimal dependencies:

- **SimpleBarChart**: Vertical bar charts
- **SimpleDonutChart**: Donut/pie charts with legend
- **SimpleTrendChart**: Line charts for trends
- **ProgressBar**: Progress/target indicators

## Features

### Mobile Responsive
- All components are built with mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Collapsible sections on mobile

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### Loading States
- Skeleton loading animations
- Graceful error handling
- Retry mechanisms

## Usage Examples

### Basic KPI Card
```jsx
<KPICard
  title="Total Revenue"
  value={250000}
  type="currency"
  trend="up"
  icon={<RevenueIcon />}
/>
```

### Dashboard Layout
```jsx
<DashboardLayout
  title="Sales Dashboard"
  subtitle="Your performance overview"
  actions={<RefreshButton />}
  filters={<DateRangePicker />}
>
  {/* Dashboard content */}
</DashboardLayout>
```

### Simple Charts
```jsx
<SimpleBarChart
  data={[
    { label: 'Honda', value: 45 },
    { label: 'Toyota', value: 32 },
    { label: 'Hyundai', value: 28 }
  ]}
  height={250}
/>
```

## Styling

Components use Tailwind CSS classes for styling:
- Consistent color palette
- Responsive breakpoints
- Hover and focus states
- Animation utilities

## Dependencies

Minimal external dependencies:
- React (core)
- Tailwind CSS (styling)
- React Router (navigation)
- React Toastify (notifications)

No heavy chart libraries or UI frameworks required!