import mongoose, { Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

interface ICategory {
	id: Types.ObjectId;
	name: string;
	description?: string;
	createdAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
	name: {
		type: String,
		required: [true, "Hãy nhập tên danh mục"],
		unique: true,
	},
	description: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

categorySchema.plugin(mongooseLeanVirtuals);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
