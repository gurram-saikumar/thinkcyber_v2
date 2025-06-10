import { Model, ModelStatic } from "sequelize";
import { Op } from "sequelize";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MothsData<T extends Model>(
  model: ModelStatic<T>
): Promise<{ last12Months: MonthData[] }> {
  try {
    if (!model) {
      throw new Error('Model is undefined');
    }

    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--) {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 28
      );

      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const count = await model.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      });

      last12Months.push({ month: monthYear, count });
    }
    return { last12Months };
  } catch (error: any) {
    console.error('Error in generateLast12MothsData:', error);
    throw new Error(`Failed to generate analytics: ${error.message}`);
  }
}
