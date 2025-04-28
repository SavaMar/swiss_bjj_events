import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Get the base directory for articles
const getArticlesDirectory = (language: string) =>
  path.join(process.cwd(), `app/articles/data/${language}`);

// Check if a directory exists
const directoryExists = (dirPath: string) => {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
};

/**
 * API route to check if article data directory exists for a language
 * @route GET /api/articles/data?language={language}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "en";

  const dirPath = getArticlesDirectory(language);
  const exists = directoryExists(dirPath);

  // If directory exists, check if it has any articles
  let articleCount = 0;
  if (exists) {
    try {
      const files = fs.readdirSync(dirPath);
      articleCount = files.filter((file) => file.endsWith(".md")).length;
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }

  // Return information about the article directory
  return NextResponse.json({
    language,
    exists,
    articleCount,
    path: dirPath.replace(process.cwd(), ""),
  });
}
