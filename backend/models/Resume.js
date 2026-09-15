import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true,index:true},content:{type:String,required:true,maxlength:20000},skills:{type:[String],default:[]},updatedAt:{type:Date,default:Date.now}},{timestamps:true});export default mongoose.model('Resume',schema);
