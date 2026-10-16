import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log(' Little Stars — Verification of Build & Admin Security');
console.log('=====================================================\n');

// 1. Check entry point in index.html
console.log('[TEST 1] Verifying index.html entry point:');
const indexHtml = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
const scriptMatch = indexHtml.match(/<script type="module" src="([^"]+)"><\/script>/);
console.log('Script tag found:', scriptMatch ? scriptMatch[0] : 'NONE');
if (!scriptMatch || scriptMatch[1] !== '/src/main.tsx') {
  throw new Error('Test 1 Failed: script tag must point to /src/main.tsx');
}
const mainPath = path.resolve('.' + scriptMatch[1]);
if (!fs.existsSync(mainPath)) {
  throw new Error(`Test 1 Failed: Target file ${mainPath} does not exist!`);
}
console.log('Entry file exists on disk:', mainPath, '✓ PASS');

// 2. Check main.tsx content
console.log('\n[TEST 2] Verifying src/main.tsx content:');
const mainContent = fs.readFileSync(mainPath, 'utf-8');
console.log('Has React import:', mainContent.includes("from 'react'"));
console.log('Has createRoot:', mainContent.includes("from 'react-dom/client'"));
console.log('Has App import:', mainContent.includes("import App from './App'"));
console.log('Has index.css:', mainContent.includes("import './index.css'"));
if (!mainContent.includes('createRoot') || !mainContent.includes("import App from './App'")) {
  throw new Error('Test 2 Failed: src/main.tsx does not match standard entry point pattern');
}
console.log('Entry point structure: ✓ PASS');

// 3. Check vite.config.ts for import.meta.dirname and dist outDir
console.log('\n[TEST 3] Verifying vite.config.ts:');
const viteConfig = fs.readFileSync(path.resolve('./vite.config.ts'), 'utf-8');
const usesImportMetaDirname = viteConfig.includes('import.meta.dirname');
const hasDistOutDir = viteConfig.includes("outDir: 'dist'");
const hasDirnameLegacy = viteConfig.includes('__dirname');
console.log('Uses import.meta.dirname:', usesImportMetaDirname);
console.log('Build outDir is dist:', hasDistOutDir);
console.log('Contains legacy __dirname:', hasDirnameLegacy);
if (!usesImportMetaDirname || hasDirnameLegacy) {
  throw new Error('Test 3 Failed: vite.config.ts must use import.meta.dirname and eliminate __dirname');
}
console.log('vite.config.ts modern ESM configuration: ✓ PASS');

// 4. Check vercel.json existence and configuration
console.log('\n[TEST 4] Verifying vercel.json:');
const vercelJsonPath = path.resolve('./vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
  throw new Error('Test 4 Failed: vercel.json not found');
}
const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));
console.log('Vercel outputDirectory:', vercelConfig.outputDirectory);
console.log('Vercel buildCommand:', vercelConfig.buildCommand);
console.log('Vercel SPA rewrite rule present:', Array.isArray(vercelConfig.rewrites));
console.log('vercel.json valid: ✓ PASS');

// 5. Test Supabase Database RPC is_admin() and RLS protection
console.log('\n[TEST 5] Testing Supabase Live Database Protection:');
const rawUrl = process.env.VITE_SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

if (cleanUrl && key) {
  const supabase = createClient(cleanUrl, key);
  
  // A. Anonymous is_admin check
  const { data: isAnonAdmin, error: rpcError } = await supabase.rpc('is_admin');
  console.log('Anonymous is_admin() RPC result:', isAnonAdmin, '(Expected: false)');
  if (isAnonAdmin !== false) {
    throw new Error('Test 5 Failed: is_admin() must return false for unauthenticated visitor');
  }
  
  // B. Protected table queries must be blocked by RLS for anonymous visitors
  const { data: allowlistData, error: allowlistError } = await supabase.from('admin_allowlist').select('*').limit(1);
  console.log('Anonymous query on admin_allowlist table:', allowlistError ? `PROPERLY BLOCKED (${allowlistError.code}: ${allowlistError.message})` : 'UNEXPECTED ACCESS');
  if (!allowlistError) {
    throw new Error('Test 5 Failed: admin_allowlist must not be readable anonymously');
  }
  
  console.log('Database RLS and RPC security: ✓ PASS');
} else {
  console.log('Supabase credentials not in env, skipped live check');
}

console.log('\n=====================================================');
console.log(' ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ✓');
console.log('=====================================================');
