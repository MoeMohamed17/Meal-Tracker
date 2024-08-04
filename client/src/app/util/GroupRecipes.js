export default function GroupRecipes(data) {
    return data.reduce((acc, item) => {
        let existingRecipe = acc.find(r => r.RECIPEID === item.RECIPEID);
        
        if (existingRecipe) {
            Object.keys(item).forEach(key => {
                if (key === 'CAPTION' || key === 'IMAGEURL') {
                    if (!existingRecipe[key]) existingRecipe[key] = [];
                    if (item[key] && !existingRecipe[key].includes(item[key])) {
                        existingRecipe[key].push(item[key]);
                    }
                } else if (key !== 'RECIPEID') {
                    if (!existingRecipe[key]) {
                        existingRecipe[key] = item[key];
                    }
                }
            });
        } else {
            const newRecipe = { RECIPEID: item.RECIPEID };
            Object.keys(item).forEach(key => {
                if (key === 'CAPTION' || key === 'IMAGEURL') {
                    newRecipe[key] = [item[key]];
                } else if (key !== 'RECIPEID') {
                    newRecipe[key] = item[key];
                }
            });
            acc.push(newRecipe);
        }
        
        return acc;
    }, []);
}