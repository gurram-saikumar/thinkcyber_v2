"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MothsData = void 0;
const sequelize_1 = require("sequelize");
async function generateLast12MothsData(model) {
    try {
        if (!model) {
            throw new Error('Model is undefined');
        }
        const last12Months = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        for (let i = 11; i >= 0; i--) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
            const monthYear = endDate.toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            const count = await model.count({
                where: {
                    createdAt: {
                        [sequelize_1.Op.gte]: startDate,
                        [sequelize_1.Op.lt]: endDate,
                    },
                },
            });
            last12Months.push({ month: monthYear, count });
        }
        return { last12Months };
    }
    catch (error) {
        console.error('Error in generateLast12MothsData:', error);
        throw new Error(`Failed to generate analytics: ${error.message}`);
    }
}
exports.generateLast12MothsData = generateLast12MothsData;
