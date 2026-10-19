// Build-time guard: parse every content JSON through its Zod schema. Non-zero
// exit on failure so `next build` dies before shipping bad data.
import { z } from 'zod';
import properties from '../data/properties.json';
import testimonials from '../data/testimonials.json';
import { PropertySchema, TestimonialSchema } from '../lib/validators';

type Report = { label: string; ok: boolean; count: number; issues?: unknown };

function run(label: string, schema: z.ZodTypeAny, data: unknown): Report {
  const r = z.array(schema).safeParse(data);
  if (r.success) return { label, ok: true, count: r.data.length };
  return { label, ok: false, count: 0, issues: r.error.issues };
}

const reports = [
  run('properties.json', PropertySchema, properties),
  run('testimonials.json', TestimonialSchema, testimonials),
];

let failed = false;
for (const r of reports) {
  if (r.ok) {
    console.log(`✓ ${r.label} — ${r.count} records valid`);
  } else {
    failed = true;
    console.error(`✗ ${r.label} — invalid`);
    console.error(JSON.stringify(r.issues, null, 2));
  }
}

if (failed) {
  console.error('\nvalidate-data: schema drift detected; aborting build.');
  process.exit(1);
}
