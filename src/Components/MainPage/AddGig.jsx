import React, { useState } from 'react'
import TagInput from './TagInput'
import { apiClient } from '../../apiClient'
import { useNavigate } from 'react-router-dom'

const imgbb = import.meta.env.VITE_IMGBB_API_KEY
const AddGig = () => {
    const navigate=useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])
    const [price, setPrice] = useState()
    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const [imgURLS, setIMGURLS] = useState([])
    const [category, setCategory] = useState('');

    const hangleImage = (e) => {
        const file = e.target.files[0]
        setImage([...image, file])
        if (file) {
            const img = URL.createObjectURL(file)
            setImagePreview([...imagePreview, img])
        }
    }

    const handleAddGIg = async () => {
        if (!title || !description || !price || image.length === 0) {
            alert("Please fill all fields and upload at least one image.");
            return;
        }

        try {
            const uploadedURLs = [];

            for (const file of image) {
                const formData = new FormData();
                formData.append('image', file);

                const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbb}`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                if (data.success) {
                    uploadedURLs.push(data.data.url);
                } else {
                    console.error('Image upload failed:', data);
                }
            }

            setIMGURLS(uploadedURLs); // optional if you want to keep them

            // Now send all data to your backend
            const gigData = {
                title,
                description,
                price,
                tags,
                category,
                images: uploadedURLs,
            };

            console.log(gigData)
            // const data = await apiClient('http://localhost:8000/gigs/', 'POST', gigData)
            const data = await apiClient('https://talentlink-nloa.onrender.com/gigs/', 'POST', gigData)
            console.log('added gig',data)
            if(data.id){
                navigate('/profile')
                setTitle('');
                setDescription('');
                setTags([]);
                setPrice('');
                setImage([]);
                setImagePreview([]);
            }
            else{
                console.log('Failed to add gig')
            }
            

        } catch (error) {
            console.error("Error uploading images or sending data:", error);
            alert("Something went wrong.");
        }
    };



    return (
        <div >
            <div className='text-center font-bold text-3xl mt-3'>Add Your Gig</div>
            <div className="max-w-3xl mx-auto py-10 px-6">

                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Title</label>
                    <input
                        type="text"

                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Description</label>
                    <textarea
                        type="text"
                        className="w-full h-32 border border-gray-300 rounded-md px-3 py-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Skills</label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Price</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Select a category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Writing">Writing</option>
                        <option value="Business Consulting">Business Consulting</option>
                        <option value="Other">Other</option>
                    </select>
                </div>


                <div className="mb-4">
                    <label className="block text-sm font-medium  mb-1">Cover Images</label>

                    {imagePreview.length > 0 ? (
                        <div className="flex flex-wrap gap-3 mb-3">
                            {imagePreview.map((img, index) => (
                                <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                    <img
                                        src={img}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = [...image];
                                            const newPreviews = [...imagePreview];
                                            newImages.splice(index, 1);
                                            newPreviews.splice(index, 1);
                                            setImage(newImages);
                                            setImagePreview(newPreviews);
                                        }}
                                        className="absolute top-1 right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-100 pb-1"
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-3">No images added yet.</p>
                    )}

                    <div>
                        <input
                            id="add-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={hangleImage}
                        />
                        <label
                            htmlFor="add-image"
                            className="inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            + Add Image
                        </label>
                    </div>
                </div>

                <div onClick={handleAddGIg} className='w-full hover:cursor-pointer hover:bg-blue-500 rounded-xl bg-blue-400 flex justify-center p-2 font-bold text-white'>Add Gig</div>





            </div>

        </div>
    )
}

export default AddGig