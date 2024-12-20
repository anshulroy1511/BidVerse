import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema =new mongoose.Schema({
    userName:{
        type: String,
        minLength: [3, "username must contain minimum 3 character"],
        maxLength: [40, "userName can not exceed from 40 charcater"]
    },
    password:{
        type: String,
        selected:false,
        minLength: [8, "password must contain minimum 8 character"],
        maxLength: [32, "password can not exceed from 32 charcater"]
    },
    email: String,
    address: String,
    phone: {
        type: String,
        minLength:[10, "phone number must contains exact 10 digits"],
        maxLength: [10, "phone number must contains exact 10 digits"],
    },
    profileImage: {
        public_id:{
            type: String,
            required: false,
        },
        url: {
            type: String,
            required : true,
        },
    },
    paymentMethods: {
        bankTransfer:{
            bankAccountNumber : String,     
            bankAccountName: String,
            bankName: String,
        },
        razorpay: {
            razorpayAccountNumber : Number,
        },
        paypal: {
            paypalEmail: String,
        },
    },

    role:{
        type: String,
        enum: ["Auctioneer", "Bidder", "Super Admin"]
    },
    // save the 5% of commision of an bid, after selling any product
    unpaidCommission : {
        type: Number,
        default: 0
    },
    auctionsWon:{
        type: Number,
        default: 0
    },
    moneySpent: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
 
// hashing the pasword :--- Pre is a middleware function in a Mongoose schema to hash a user's password before saving it to the database.
userSchema.pre("save" , async function (next){
    // This checks whether the password field has been modified.
    //If the password is not modified (e.g., updating other fields), it calls next() to skip hashing.
    if(!this.isModified("password")){        
        next();
    }
   // If the password is modified or newly created, it hashes the password using bcrypt.
   //The second argument, 10, is the salt rounds indicating the computational cost of generating the hash.
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY ,{
        expiresIn : process.env.JWT_EXPIRE,
    })
}
export const User = mongoose.model("User", userSchema);