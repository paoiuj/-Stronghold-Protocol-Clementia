// test/helpers/customChess.js — how many chess tools/custom-operators/ adds to the season.
//
// The official season ships 112 visible non-DIY chess. Every spec in tools/custom-operators/ adds one more visible
// base chess (plus its golden), so the roster guards in the tests use OFFICIAL_VISIBLE + CUSTOM_COUNT: adding an
// operator needs no test edit, while an accidental change to the official roster still fails.
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = join(ROOT, 'tools', 'custom-operators');

/** Visible non-DIY chess of the official season (data/chess.json without any custom operator). */
export const OFFICIAL_VISIBLE = 112;

/** Operator specs under tools/custom-operators/ — each contributes one visible non-DIY base chess (tier 6 today). */
export const CUSTOM_COUNT = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.json')).length : 0;

/** Expected number of visible non-DIY chess in data/chess.json. */
export const VISIBLE_CHESS = OFFICIAL_VISIBLE + CUSTOM_COUNT;

/** Expected number of records (base + golden) in data/chess.json. */
export const OFFICIAL_CHESS_RECORDS = 266;
export const CHESS_RECORDS = OFFICIAL_CHESS_RECORDS + CUSTOM_COUNT * 2;
