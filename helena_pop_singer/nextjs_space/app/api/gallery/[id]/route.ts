
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/s3';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingItem = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    let imageUrl = existingItem.imageUrl;

    if (file) {
      // Delete old image if exists
      if (existingItem.imageUrl) {
        try {
          await deleteFile(existingItem.imageUrl);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `gallery/${Date.now()}-${file.name}`;
      const cloud_storage_path = await uploadFile(buffer, fileName);
      imageUrl = cloud_storage_path;
    }

    const galleryItem = await prisma.galleryItem.update({
      where: { id: params.id },
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
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Delete image from S3 if exists
    if (galleryItem.imageUrl) {
      try {
        await deleteFile(galleryItem.imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await prisma.galleryItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Gallery item deleted' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
