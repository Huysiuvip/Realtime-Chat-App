import multer from 'multer'  // thư viện giúp đọc file gửi lên từ request
import { v2 as cloudinary } from 'cloudinary';

export const upload = multer({
    storage : multer.memoryStorage(), // lưu file dưới dạng dữ liệu thô trong ram
    limits : {
        fieldSize : 1024 * 1024 * 1, //giời hạn dữ liệu tải lên là 1mb
    }
})

export const uploadImageFromBuffer = (buffer, options) =>{
    return new Promise((resolve, reject) =>{
        const uploadStream = cloudinary.uploader.upload_stream({
            folder : "chat_app/avatars",
            resource_type : 'image',
            transformation :[{with: 200, height: 200, crop: 'fill'}],
            ...options
        }, 
        (error, result) =>{
            if(error) {
                reject(error)
            }else{
                resolve(result)
            }
        }
        );

        uploadStream.end(buffer)
    })
}