#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────────
// scripts/resume-check.mjs
//
// Drift report between the resume PDF and src/data/resume.js.
//
// Run with:   npm run resume:check
//
// Strategy: extract all text from the PDF, normalize it (lowercase, unify
// smart quotes / em-dashes / ™, collapse whitespace), then walk the
// structured data from src/data/resume.js and flag any string that doesn't
// appear as a substring of the normalized PDF text.
//
// This catches the common drift case — "I edited the PDF but forgot to
// update the data file" (or vice versa). It does NOT catch content in the
// PDF that's missing from the data file; for that, eyeball the PDF.
//
// Exit codes:
//   0 → everything in the data file was found in the PDF
//   1 → one or more fields drifted (details printed)
//   2 → script failed to run (missing PDF, parse error, etc.)
// ──────────────────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// pdf-parse v2 exports a PDFParse class. Construct with { data: Buffer }
// and call .getText() — see https://www.npmjs.com/package/pdf-parse.
import { PDFParse } from 'pdf-parse'

import {
  SUMMARY,
  SKILLS,
  EXPERIENCE,
  EARLIER_CAREER,
  EDUCATION,
  CONTACT,
} from '../src/data/resume.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')
const PDF_PATH = path.join(ROOT, 'public', 'christy_sheppard_resume.pdf')

if (!existsSync(PDF_PATH)) {
  console.error(`[resume-check] PDF not found at ${PDF_PATH}`)
  process.exit(2)
}

// Normalize text so trivial formatting differences don't cause false
// positives. Keep in sync with whatever variations actually appear in the
// PDF export vs. what's hand-typed in the JS file.
function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")             // curly single quotes
    .replace(/[\u201C\u201D]/g, '"')             // curly double quotes
    .replace(/[\u2013\u2014\u2010\u2011]/g, '-') // en/em/hyphen variants
    .replace(/\u2122/g, '')                      // ION™ → ion
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, '-')                    // "1999 - 2003" → "1999-2003"
    .replace(/^@/, '')                           // social handles: "@x" matches "x"
    .trim()
}

let pdfNorm = ''
try {
  const pdfBuffer = readFileSync(PDF_PATH)
  const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) })
  const { text } = await parser.getText()
  pdfNorm = normalize(text)
} catch (err) {
  console.error('[resume-check] Failed to parse PDF:', err.message)
  process.exit(2)
}

const misses = []

function check(label, value) {
  if (value == null || value === '') return
  const norm = normalize(value)
  if (!pdfNorm.includes(norm)) misses.push({ label, value })
}

// ── SUMMARY ──
check('SUMMARY', SUMMARY)

// ── SKILLS ── each value in every category
for (const group of SKILLS) {
  for (const v of group.values) {
    check(`SKILLS[${group.key}] · ${v}`, v)
  }
}

// ── CONTACT ──
check('CONTACT.email',    CONTACT.email)
check('CONTACT.location', CONTACT.location)
check('CONTACT.site',     CONTACT.site)
// phone is optional — only check if present
if (CONTACT.phone) check('CONTACT.phone', CONTACT.phone)
// CONTACT.linkedin.label and CONTACT.github.label are intentionally NOT
// checked: in the PDF those appear as the words "LinkedIn" and "GitHub"
// (hyperlink anchors), not as the @handles. The labels are display-only
// conventions used by the JSON-style contact block on the website.

// ── EXPERIENCE ──
for (const role of EXPERIENCE) {
  check(`${role.id}.company`, role.company)
  check(`${role.id}.title`,   role.title)
  check(`${role.id}.period`,  role.period)

  const sections = role.subsections || [{ bullets: role.bullets }]
  for (const sec of sections) {
    if (sec.heading) check(`${role.id}.section.heading · ${sec.heading}`, sec.heading)
    for (const b of sec.bullets || []) {
      check(`${role.id}.bullet`, b)
    }
  }
}

// ── EARLIER_CAREER ──
check('EARLIER_CAREER.company', EARLIER_CAREER.company)
check('EARLIER_CAREER.period',  EARLIER_CAREER.period)

// ── EDUCATION ──
for (const e of EDUCATION) {
  check('EDUCATION.school',  e.school)
  check('EDUCATION.period',  e.period)
  if (e.program) check('EDUCATION.program', e.program)
  if (e.note)    check('EDUCATION.note',    e.note)
}

// ── Report ──
if (misses.length === 0) {
  console.log('[resume-check] OK — every field in src/data/resume.js was found in the PDF.')
  process.exit(0)
}

console.log(`[resume-check] DRIFT — ${misses.length} field(s) in src/data/resume.js do not appear in the PDF.`)
console.log('')
console.log('These strings were not found in public/christy_sheppard_resume.pdf:')
console.log('  (If the PDF is the source of truth, edit src/data/resume.js to match.)')
console.log('  (If the data file is intentionally ahead, export a fresh PDF — the pre-commit hook')
console.log('   will bump RESUME_PDF_VERSION when the PDF lands in a commit.)')
console.log('')

for (const m of misses) {
  const preview = m.value.length > 140 ? m.value.slice(0, 137) + '…' : m.value
  console.log(`  - ${m.label}`)
  console.log(`      "${preview}"`)
}

process.exit(1)
