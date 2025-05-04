import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  mealImageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId: clerkId } = await auth();
      if (!clerkId) throw new UploadThingError("Unauthorized");

      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) throw new UploadThingError("User not found");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
