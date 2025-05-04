"use server";

import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const utapi = new UTApi();

export const deleteUploadedFile = async (
  fileUrl: string | null
): Promise<{ success: boolean; error?: string }> => {
  const { userId } = await auth();
  if (!userId) {
    console.error("Delete Upload Error: User not authenticated.");
    return { success: false, error: "User not authenticated." };
  }

  if (!fileUrl) {
    console.error("Delete Upload Error: fileUrl is null or undefined.");
    return { success: false, error: "File URL not provided." };
  }

  try {
    const fileKey = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

    if (typeof fileKey !== "string" || !fileKey) {
      throw new Error("Invalid file key provided for deletion.");
    }

    const deleteResult = await utapi.deleteFiles(fileKey);

    if (deleteResult?.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "UploadThing failed to delete the file.",
      };
    }
  } catch (error) {
    console.error(`Error deleting file ${fileUrl} from UploadThing:`, error);
    return {
      success: false,
      error: `Failed to delete uploaded file: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
