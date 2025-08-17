import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input - Always on new line */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
        placeholder="Type and press Enter"
      />
    </div>
  );
};

export default TagInput;
