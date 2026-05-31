"use server";

import { db } from "@/lib/db";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { ProjectType } from "@/store/usePortfolioStore";
import { revalidatePath } from "next/cache";

// Temporary in-memory storage for mutations when DB is disconnected
let localProjectsState: ProjectType[] = [];
let localCategoriesState = [...MOCK_CATEGORIES];

// Cache seeding status in-memory for the current container lifecycle
let categoriesSeeded = false;

/**
 * Helper to check if database connection is alive
 */
async function isDbConnected(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ensures all categories in MOCK_CATEGORIES are present in the database.
 * Optimized to prevent repeated sequential database upserts on every query.
 */
async function ensureCategoriesSeeded() {
  if (categoriesSeeded) return;
  try {
    const dbConnected = await isDbConnected();
    if (!dbConnected) return;

    // First check if categories are already in database via a single quick count query
    const count = await db.category.count();
    if (count >= MOCK_CATEGORIES.length) {
      categoriesSeeded = true;
      return;
    }

    for (const cat of MOCK_CATEGORIES) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: { id: cat.id, name: cat.name, slug: cat.slug },
      });
    }
    categoriesSeeded = true;
  } catch (error) {
    console.error("ensureCategoriesSeeded failed:", error);
  }
}

/**
 * Fetch all published projects.
 * Automatically returns empty array or local state if database is empty or connection fails.
 */
export async function getProjectsAction(): Promise<ProjectType[]> {
  try {
    // Ensure all 9 categories are seeded
    await ensureCategoriesSeeded();

    const projects = await db.project.findMany({
      include: {
        category: true,
        media: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
      thumbnail: p.thumbnail,
      media: p.media.map((m) => ({
        id: m.id,
        url: m.url,
        type: m.type,
      })),
      projectType: p.projectType,
      websiteLink: p.websiteLink,
      sourceCodeLink: p.sourceCodeLink,
      pricing: p.pricing,
      featured: p.featured,
      published: p.published,
      subType: p.subType,
      tags: p.tags.map((t) => ({
        id: t.id,
        name: t.name,
      })),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Prisma: database project fetch failed, returning in-memory state.", error);
    return localProjectsState;
  }
}

/**
 * Fetch all categories.
 */
export async function getCategoriesAction() {
  try {
    // Ensure all 9 categories are seeded
    await ensureCategoriesSeeded();

    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  } catch (error) {
    console.warn("Prisma: database category fetch/seed failed, returning in-memory state.", error);
    return localCategoriesState;
  }
}

/**
 * Create a new project.
 */
export async function createProjectAction(data: {
  title: string;
  description: string;
  categoryId: string;
  thumbnail: string;
  projectType: string;
  websiteLink?: string;
  sourceCodeLink?: string;
  pricing?: string;
  featured?: boolean;
  published?: boolean;
  subType?: string;
  tags: string[]; // names of tags
  media: { url: string; type: string }[];
}): Promise<{ success: boolean; project?: ProjectType; error?: string }> {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  try {
    const dbConnected = await isDbConnected();
    
    if (!dbConnected) {
      // Return local memory fallback
      const cat = localCategoriesState.find(c => c.id === data.categoryId) || localCategoriesState[0];
      const newProj: ProjectType = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        category: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        },
        thumbnail: data.thumbnail,
        projectType: data.projectType,
        websiteLink: data.websiteLink || null,
        sourceCodeLink: data.sourceCodeLink || null,
        pricing: data.pricing || null,
        featured: data.featured || false,
        published: data.published !== undefined ? data.published : true,
        subType: data.subType || null,
        tags: data.tags.map((t, idx) => ({ id: String(idx), name: t })),
        media: data.media.map((m, idx) => ({ id: String(idx), url: m.url, type: m.type })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localProjectsState = [newProj, ...localProjectsState];
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true, project: newProj };
    }

    // Database flow
    const createdProject = await db.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        thumbnail: data.thumbnail,
        projectType: data.projectType,
        websiteLink: data.websiteLink || null,
        sourceCodeLink: data.sourceCodeLink || null,
        pricing: data.pricing || null,
        featured: data.featured || false,
        published: data.published !== undefined ? data.published : true,
        subType: data.subType || null,
        category: {
          connect: { id: data.categoryId }
        },
        tags: {
          connectOrCreate: data.tags.map(t => ({
            where: { name: t },
            create: { name: t }
          }))
        },
        media: {
          create: data.media.map(m => ({
            url: m.url,
            type: m.type
          }))
        }
      },
      include: {
        category: true,
        media: true,
        tags: true,
      }
    });

    const project: ProjectType = {
      id: createdProject.id,
      title: createdProject.title,
      slug: createdProject.slug,
      description: createdProject.description,
      categoryId: createdProject.categoryId,
      category: {
        id: createdProject.category.id,
        name: createdProject.category.name,
        slug: createdProject.category.slug,
      },
      thumbnail: createdProject.thumbnail,
      media: createdProject.media.map(m => ({ id: m.id, url: m.url, type: m.type })),
      projectType: createdProject.projectType,
      websiteLink: createdProject.websiteLink,
      sourceCodeLink: createdProject.sourceCodeLink,
      pricing: createdProject.pricing,
      featured: createdProject.featured,
      published: createdProject.published,
      subType: createdProject.subType,
      tags: createdProject.tags.map(t => ({ id: t.id, name: t.name })),
      createdAt: createdProject.createdAt.toISOString(),
      updatedAt: createdProject.updatedAt.toISOString(),
    };

    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, project };
  } catch (error: any) {
    console.error("Prisma project create failed:", error);
    return { success: false, error: error.message || "Database write failed" };
  }
}

/**
 * Update an existing project.
 */
export async function updateProjectAction(
  id: string,
  data: {
    title: string;
    description: string;
    categoryId: string;
    thumbnail: string;
    projectType: string;
    websiteLink?: string;
    sourceCodeLink?: string;
    pricing?: string;
    featured?: boolean;
    published?: boolean;
    subType?: string;
    tags: string[]; // names of tags
    media: { url: string; type: string }[];
  }
): Promise<{ success: boolean; project?: ProjectType; error?: string }> {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  try {
    const dbConnected = await isDbConnected();
    
    if (!dbConnected) {
      const idx = localProjectsState.findIndex(p => p.id === id);
      if (idx === -1) return { success: false, error: "Project not found in memory" };
      
      const cat = localCategoriesState.find(c => c.id === data.categoryId) || localCategoriesState[0];
      const updatedProj: ProjectType = {
        ...localProjectsState[idx],
        title: data.title,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        category: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        },
        thumbnail: data.thumbnail,
        projectType: data.projectType,
        websiteLink: data.websiteLink || null,
        sourceCodeLink: data.sourceCodeLink || null,
        pricing: data.pricing || null,
        featured: data.featured || false,
        published: data.published !== undefined ? data.published : true,
        subType: data.subType || null,
        tags: data.tags.map((t, index) => ({ id: String(index), name: t })),
        media: data.media.map((m, index) => ({ id: String(index), url: m.url, type: m.type })),
        updatedAt: new Date().toISOString(),
      };
      
      localProjectsState[idx] = updatedProj;
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true, project: updatedProj };
    }

    // Database flow:
    // 1. Delete all existing media associated with this project first.
    await db.media.deleteMany({
      where: { projectId: id }
    });

    // 2. Disconnect current tags
    await db.project.update({
      where: { id },
      data: {
        tags: {
          set: [] // clears relationships
        }
      }
    });

    // 3. Perform main project update with new tags and media
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        thumbnail: data.thumbnail,
        projectType: data.projectType,
        websiteLink: data.websiteLink || null,
        sourceCodeLink: data.sourceCodeLink || null,
        pricing: data.pricing || null,
        featured: data.featured || false,
        published: data.published !== undefined ? data.published : true,
        subType: data.subType || null,
        category: {
          connect: { id: data.categoryId }
        },
        tags: {
          connectOrCreate: data.tags.map(t => ({
            where: { name: t },
            create: { name: t }
          }))
        },
        media: {
          create: data.media.map(m => ({
            url: m.url,
            type: m.type
          }))
        }
      },
      include: {
        category: true,
        media: true,
        tags: true,
      }
    });

    const project: ProjectType = {
      id: updatedProject.id,
      title: updatedProject.title,
      slug: updatedProject.slug,
      description: updatedProject.description,
      categoryId: updatedProject.categoryId,
      category: {
        id: updatedProject.category.id,
        name: updatedProject.category.name,
        slug: updatedProject.category.slug,
      },
      thumbnail: updatedProject.thumbnail,
      media: updatedProject.media.map(m => ({ id: m.id, url: m.url, type: m.type })),
      projectType: updatedProject.projectType,
      websiteLink: updatedProject.websiteLink,
      sourceCodeLink: updatedProject.sourceCodeLink,
      pricing: updatedProject.pricing,
      featured: updatedProject.featured,
      published: updatedProject.published,
      subType: updatedProject.subType,
      tags: updatedProject.tags.map(t => ({ id: t.id, name: t.name })),
      createdAt: updatedProject.createdAt.toISOString(),
      updatedAt: updatedProject.updatedAt.toISOString(),
    };

    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, project };
  } catch (error: any) {
    console.error("Prisma project update failed:", error);
    return { success: false, error: error.message || "Database update failed" };
  }
}

/**
 * Toggle Project Published state.
 */
export async function toggleProjectPublishAction(id: string): Promise<{ success: boolean; published?: boolean }> {
  try {
    const dbConnected = await isDbConnected();
    
    if (!dbConnected) {
      const idx = localProjectsState.findIndex(p => p.id === id);
      if (idx !== -1) {
        localProjectsState[idx].published = !localProjectsState[idx].published;
        revalidatePath("/work");
        revalidatePath("/");
        return { success: true, published: localProjectsState[idx].published };
      }
      return { success: false };
    }

    const project = await db.project.findUnique({ where: { id } });
    if (!project) return { success: false };

    const updated = await db.project.update({
      where: { id },
      data: { published: !project.published },
    });

    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, published: updated.published };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Delete a project.
 */
export async function deleteProjectAction(id: string): Promise<{ success: boolean }> {
  try {
    const dbConnected = await isDbConnected();
    
    if (!dbConnected) {
      localProjectsState = localProjectsState.filter(p => p.id !== id);
      revalidatePath("/work");
      revalidatePath("/");
      return { success: true };
    }

    await db.project.delete({
      where: { id },
    });

    revalidatePath("/work");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Prisma project delete failed:", error);
    return { success: false };
  }
}

/**
 * Toggle Project Featured state.
 */
export async function toggleProjectFeaturedAction(id: string): Promise<{ success: boolean; featured?: boolean }> {
  try {
    const dbConnected = await isDbConnected();
    
    if (!dbConnected) {
      const idx = localProjectsState.findIndex(p => p.id === id);
      if (idx !== -1) {
        localProjectsState[idx].featured = !localProjectsState[idx].featured;
        revalidatePath("/work");
        revalidatePath("/");
        return { success: true, featured: localProjectsState[idx].featured };
      }
      return { success: false };
    }

    const project = await db.project.findUnique({ where: { id } });
    if (!project) return { success: false };

    const updated = await db.project.update({
      where: { id },
      data: { featured: !project.featured },
    });

    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, featured: updated.featured };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Create a new category.
 */
export async function createCategoryAction(name: string): Promise<{ success: boolean; category?: { id: string; name: string; slug: string }; error?: string }> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  try {
    const isConnected = await isDbConnected();
    if (!isConnected) {
      const newCat = {
        id: "cat-" + Math.random().toString(36).substring(2, 9),
        name,
        slug
      };
      localCategoriesState = [...localCategoriesState, newCat];
      return { success: true, category: newCat };
    }

    const category = await db.category.create({
      data: { name, slug }
    });

    return {
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
  } catch (error: any) {
    console.error("Prisma category create failed:", error);
    return { success: false, error: error.message || "Database write failed" };
  }
}

/**
 * Delete a category.
 */
export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const isConnected = await isDbConnected();
    if (!isConnected) {
      localCategoriesState = localCategoriesState.filter(c => c.id !== id);
      return { success: true };
    }

    await db.category.delete({
      where: { id }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Prisma category delete failed:", error);
    return { success: false, error: error.message || "Database delete failed" };
  }
}
