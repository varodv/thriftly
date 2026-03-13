# thriftly - Project Context for Agents

## Overview

thriftly is a modern, web-based personal finance and budget tracking application. It features comprehensive transaction management, complex data categorizations, and detailed financial data visualizations, including cash flow charts and categories charts.

## Tech Stack & Dependencies

- **Framework:** Next.js (App Router, v16.1+)
- **Library:** React (v19.2+)
- **Styling:** Tailwind CSS (v4) with `tw-animate-css`
- **UI Components:** Shadcn UI (built on Radix UI primitives like `dialog`, `popover`, `select`, `slot`, etc.)
  - _CRITICAL NOTE:_ The developer explicitly prefers using **Shadcn** to install required UI elements. Always prioritize adding a Shadcn component over building a custom primitive from scratch.
- **Data Visualization:** `recharts` (used extensively for customized charts)
- **Icons:** `lucide-react`
- **Internationalization:** `react-intl`
- **Date Handling:** `date-fns`, `react-day-picker`
- **Other Utilities:** `sonner` (toasts notifications), `vaul` (drawers), `@base-ui/react`, `clsx`, `tailwind-merge`
- **Testing:** `vitest`, `@testing-library/react`
- **Linting & Code Quality:** `eslint` (via `@antfu/eslint-config`), `husky` for git hooks, `lint-staged`.

## Project Structure

- `/app`: Next.js App Router root containing main pages, layout (`layout.tsx`), and global styles (`globals.css`).
- `/components`: Domain-specific React components (`transaction-list`, `cash-flow-card`, charts, filters, dialogs).
- `/components/ui`: Shadcn UI primitives and generic, reusable UI pieces.
- `/context`: React Context definitions for application state (`transaction-context.tsx`, `category-context.tsx`).
- `/providers`: Wrapper components for React Contexts.
- `/hooks`: Custom React hooks mapping to domain logic.
- `/lib`: Helper and utility files (`utils.ts`, `entity.ts`).
- `/i18n`: Internationalization dictionaries and configuration.

## Development Guidelines

- **Adding UI Elements:** Check Shadcn first. Use the Shadcn CLI to scaffold primitives when needed.
- **Styling:** Utilize Tailwind utility classes. For merged or conditional class names, utilize the `cn` utility normally exported from `lib/utils.ts`.
- **Charts:** All data visualization relies on `recharts`. A pattern in this project is highly customized charts—such as injecting Lucide icons into `Recharts` axes and label formatters, handling dynamic gradients (e.g., stopping red color at 0 on Y-axis for balances), and customizing tooltips.
- **State Management:** Core application state relies on React Context (`/context`), meaning transactions and categories are piped through standard Provider/Consumer patterns rather than external state managers like Redux.
- **TypeScript:** The project enforces strict typing. Be meticulous about state setter types (e.g., `Dispatch<SetStateAction<boolean | undefined>>` vs `boolean`).
- **Formatting Constraints:** The project maintains a strict **100-character line length limit** enforced by ESLint. Ensure your code generation wraps lines accordingly.
