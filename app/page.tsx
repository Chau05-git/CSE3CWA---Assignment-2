import React from "react";
import "./homepage.css";
import Navbar from "./Components/Navbar";
import Header from './Components/Headers';
import CodeDisplay from "./Components/CodeDisplay";


import path from 'node:path';
import fs from 'node:fs/promises';

export const runtime = 'nodejs'; 

/* AI help me build code generate feature
 Basically it collect all code from only tsx file and present it in code display box */
const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.turbo',
  '.vercel',
  'coverage',
  '.vscode',
  '.idea',
]);

async function collectTsxFiles(dir: string, root: string, acc: string[]) {
  let entries: any[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return; 
  }

  for (const entry of entries) {
    const name = entry.name;
    const abs = path.join(dir, name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(name)) {
        await collectTsxFiles(abs, root, acc);
      }
    } else if (entry.isFile()) {
      if (name.toLowerCase().endsWith('.tsx')) {
        const rel = path.relative(root, abs);
        acc.push(rel);
      }
    }
  }
}

async function buildOutput(): Promise<string> {
  const root = process.cwd();
  const files: string[] = [];
  await collectTsxFiles(root, root, files);
  files.sort((a, b) => a.localeCompare(b));

  const parts: string[] = [];
  for (const rel of files) {
    const abs = path.join(root, rel);
    try {
      const content = await fs.readFile(abs, 'utf8');
      parts.push(
        `// ===========================\n// File: ${rel}\n// ===========================\n\n${content}\n`
      );
    } catch {
      
    }
  }

  return parts.join('\n');
}


const Title_of_Page = () => {
  return(
  <h1 className="fixed_title">Welcome to my website</h1>
  );
}

const Student_No = () => {
  return(
  <h2 className="student_no">Student No: 21654237</h2>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer_content">
        <p>&copy; {currentYear} All rights reserved</p>
        <p>Student Name: Le Ngoc Minh Chau</p>
        <p>Student Number: 21654237</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>
    </footer>
  );
}


export default async function Main_Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  
  const params = await searchParams;
  const shouldGenerate = typeof params?.gen !== "undefined" && params?.gen !== "0";
  const code = shouldGenerate ? await buildOutput() : "";

  return(
    <main className="main_page">
      <Title_of_Page/>
      <Student_No/>
      <Navbar/>
      <Header/>
      {/* <CodeDisplay code={code}/> */}
      <CodeDisplay code={code}/>
      <Footer/>
    </main>
  );
}