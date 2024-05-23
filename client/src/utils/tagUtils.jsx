export const addTag = (tags, setTags, newTag, maxTags = 5) => {
    if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
        setTags([...tags, newTag]);
    } else if (tags.length >= maxTags) {
        alert(`최대 ${maxTags}개의 태그만 추가할 수 있습니다.`);
    }
};

export const removeTag = (tags, setTags, tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
};