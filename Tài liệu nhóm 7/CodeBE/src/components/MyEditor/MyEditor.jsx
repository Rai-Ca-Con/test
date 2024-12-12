import React, { useRef } from "react";
import ReactQuill from "react-quill-new"; // Sử dụng phiên bản mới của React Quill
import axiosClient from "../../api/axiosClient";
import "react-quill-new/dist/quill.snow.css";

const MyEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "image"],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],   
        [{ 'align': [] }],
        ["code-block"],
        
      ],
    },
  };

  const handleImageUploadFromBase64 = async (base64String) => {
    const base64Image = base64String.split(',')[1]; // Lấy phần sau dấu phẩy
    const formData = new FormData();
    
    const blob = await fetch(`data:image/jpeg;base64,${base64Image}`).then(res => res.blob());
    formData.append("file", blob, "uploaded_image.jpg"); // Thay đổi tên file nếu cần

    try {
      const response = await axiosClient.post("/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      const imageName = response.data.result; // Nhận tên hình ảnh từ phản hồi
      const imageUrl = `http://localhost:8080/api/v1/image/view/${imageName}`; // Tạo URL hình ảnh
      
      return imageUrl; // Trả về URL hình ảnh
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Ném lỗi để xử lý sau
    }
  };

  const handleChange = async (content) => {
    const base64Images = content.match(/<img src="data:image\/[^;]+;base64,([^"]+)"/g);
    if (base64Images) {
      for (let imgTag of base64Images) {
        const base64String = imgTag.match(/data:image\/[^;]+;base64,([^"]+)/)[0];
        const imageUrl = await handleImageUploadFromBase64(base64String);
        
        // Thay thế img tag bằng URL hình ảnh với kích thước quy định
        const newImgTag = `<img src="${imageUrl}" width="500" height="500" /`; // Đặt width và height ở đây
        content = content.replace(imgTag, newImgTag);
      }
    }

    // Cập nhật giá trị mới cho editor
    onChange(content); // Gọi hàm onChange để cập nhật giá trị
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={handleChange}
      modules={modules}
      placeholder="Compose an epic..."
      theme="snow"
    />
  );
};

export default MyEditor;