import { NextRequest, NextResponse } from "next/server";
import { projectStore } from "@/lib/dev/data-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const urgency = searchParams.get("urgency") || "";
  const sort = searchParams.get("sort") || "recent";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 12);

  let projects = projectStore.getAll().filter((p) => p.status === "ouvert");

  if (category)
    projects = projects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  if (urgency) projects = projects.filter((p) => p.urgency === urgency);

  switch (sort) {
    case "budget_asc":
      projects.sort((a, b) => a.budgetMin - b.budgetMin);
      break;
    case "budget_desc":
      projects.sort((a, b) => b.budgetMax - a.budgetMax);
      break;
    case "deadline":
      projects.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
      break;
    default:
      projects.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
  }

  const total = projects.length;
  const offset = (page - 1) * limit;
  const paginated = projects.slice(offset, offset + limit);

  return NextResponse.json({
    projects: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
