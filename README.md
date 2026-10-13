# WardWise

**A community issue reporting and tracking system.**

WardWise is a Community Engagement Project (CEP) prototype designed to help people record local concerns—such as waste collection, water leakage, damaged roads, broken streetlights, and drainage problems—and follow their current status in one simple interface.

> **Prototype notice:** WardWise stores reports in the browser's `localStorage`. Reports are not sent to municipal authorities, are not synchronized between devices, and can be managed by anyone who can access the local management page. Do not enter sensitive personal information.

## Features

- **Overview dashboard** with totals for all reports and their current statuses.
- **Issue submission form** with title, category, location, and description fields.
- **Report directory** with search and category/status filters.
- **Report details** with the report ID, status, dates, and activity history.
- **Manage reports** page to update a report's status.
- **Browser persistence** so reports remain after refresh in the same browser.
- **Sample data controls** to restore demo reports or clear the local dataset.
- **Responsive interface** designed for desktop, tablet, and mobile screens.

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui and Radix UI components
- Lucide React icons
- React Router
- Browser `localStorage`

## Getting started

### Requirements

Install a current supported version of [Node.js](https://nodejs.org/) that includes npm.

### Install dependencies

Clone the repository and open its directory:

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will print a local URL in the terminal (often `http://localhost:5173/`). Open that URL in your browser. If Vite selects a different port, use the URL it prints.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

Use the commands defined in `package.json` if your project scripts differ.

## Using WardWise

1. Open the Overview page to browse reports and view status totals.
2. Select **Report an Issue** to submit a new community concern.
3. Open a report to see its details and activity history.
4. Open **Manage Reports** to change a report's status.
5. Use the sample-data controls to restore demonstration reports or clear the current browser dataset.

Sample reports are fictional and are intended for demonstration only.

## Data and limitations

- Data is stored locally in the current browser profile using `localStorage`.
- Clearing browser site data may remove saved reports.
- Reports are not shared with other users or devices.
- The management page is a demonstration interface, not a secured administrator portal.
- WardWise does not contact civic authorities or confirm that an issue has been resolved in the real world.
- Community feedback and any real-world impact assessment should be collected separately as part of the CEP activity.

## Testing

If browser tests are configured in the project, run them using the scripts documented in `package.json`. A production build can be checked with:

```bash
npm run build
```

For a manual check, submit a report, search/filter it, update its status, refresh the browser, and verify the empty-state and sample-restore controls.

## Contributing

This project was created for educational and community-engagement purposes. For changes, create a branch, make a focused update, and verify the build and affected user flows before submitting a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
