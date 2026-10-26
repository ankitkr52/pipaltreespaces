import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// globals:false means Testing Library's auto-cleanup (which hooks the global
// afterEach) never registers — unmount between tests ourselves.
afterEach(cleanup);
