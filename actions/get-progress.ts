import {prisma} from "@/lib/db";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapters = await prisma.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            },
            select: {
                id: true
            },
        })

        const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

        const validCompletedChapters = await prisma.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChapterIds
                },
                isCompleted: true
            }
        });

        const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

        return progressPercentage;

    } catch (error) {
        console.log("[GET PROGESS ACTION]", error);
        return 0;
    }
}