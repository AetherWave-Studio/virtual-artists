
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/s3';

export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const published = formData.get('published') === 'true';
    const file = formData.get('file') as File | null;

    let imageUrl = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `gallery/${Date.now()}-${file.name}`;
      const cloud_storage_path = await uploadFile(buffer, fileName);
      // For now, we'll use a placeholder URL since we need signed URLs for downloads
      imageUrl = cloud_storage_path;
    }

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
        content: content || null,
        type: type || 'image',
        published,
        imageUrl,
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
