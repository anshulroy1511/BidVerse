// here only those commission payments that are approved by the super admin------------

import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
    amount : Number,
    user: mongoose.Schema.Types.ObjectId,
    createdAt : {
        type: Date,
        default : Date.now,
    },
});

export const Commission = mongoose.model("Commission", commissionSchema);
