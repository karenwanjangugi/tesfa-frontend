This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



This PR introduces the TasksAdmin component, forming the core of the new admin task-tracking page. This page offers administrators a centralized view to monitor 
  and manage task assignments.

  What is this?
  The TasksAdmin component provides a dashboard with key statistics (Predicted Cases, Total Interventions, Completed Tasks) and a searchable, paginated list of 
  task assignments.

  Why this?
  This new page addresses the need for administrators to efficiently track and oversee tasks and their assignments to various organizations, offering both 
  high-level insights and detailed assignment information.

  How are you doing this?
   - Implemented useState for managing search queries and pagination.
   - Utilized the useDashboardData custom hook (from ../../../hooks/useTaskPageData) to fetch and process task assignments, predictions, task titles, and 
     organization names.
   - Dynamically calculates and displays dashboard statistics.
   - Features client-side filtering of task assignments by title, organization name, or status.
   - Includes pagination controls for navigating through task assignment lists.
   - Employs framer-motion for animations and react-icons/fa for the search icon.
   - Applies dynamic styling for task statuses to enhance readability.

  List of updates for features, enhancements, or bugfixes
   - Feature: Admin Task Tracking Dashboard: Introduces a dashboard displaying "Predicted Cases," "Total Interventions," and "Completed Tasks."
   - Feature: Searchable Task Assignments: Enables administrators to search task assignments by task title, organization name, or status.
   - Feature: Paginated Task Assignments: Provides pagination for efficient browsing of task assignments.
   - Enhancement: Dynamic Status Display: Task statuses are rendered with distinct colors and user-friendly display names.
   - Integration: Leverages the useDashboardData hook for streamlined data fetching and processing.

  Type of change
   - New feature (non-breaking change which adds functionality)
   - Improvement (Provides a new administrative tool for task oversight)

  How can it be tested?
   1. Access the page: Navigate to the /admin/task-tracking route in the application.
   2. Verify Dashboard Statistics: Confirm that "Predicted Cases", "Total Interventions", and "Completed Tasks" display accurate counts.
   3. Test Search Functionality:
       * Enter various task titles, organization names, or statuses into the search bar and verify that the list filters correctly.
       * Test with a search query that yields no results to ensure the "No results found" message appears.
   4. Test Pagination:
       * If the number of tasks exceeds 5, verify the presence and functionality of "Previous" and "Next" buttons, and the "Page X of Y" indicator.
       * Confirm that "Previous" is disabled on the first page and "Next" is disabled on the last page.
   5. Verify Status Display: Check that task statuses are displayed with their intended colors and display names (e.g., "Completed" in green, "Pending" in red).
   6. Error and Loading States:
       * Observe the "Loading dashboard data..." message during data fetching.
       * (If possible) Simulate an error in data fetching to confirm the error message is displayed.

  Where is it documented?
  N/A

  List JIRA tickets
  N/A