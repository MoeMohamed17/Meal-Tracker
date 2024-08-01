export default function GroupRecipes(data) {
    return data.reduce((acc, item) => {
        let existingRecipe = acc.find(r => r.RECIPEID === item.RECIPEID);
        
        if (existingRecipe) {
            Object.keys(item).forEach(key => {
                if (key !== 'RECIPEID') {
                    if (!existingRecipe[key]) existingRecipe[key] = [];
                    if (!existingRecipe[key].includes(item[key])) existingRecipe[key].push(item[key]);
                }
            });
        } else {
            const newRecipe = { RECIPEID: item.RECIPEID };
            Object.keys(item).forEach(key => {
                if (key !== 'RECIPEID') newRecipe[key] = [item[key]];
            });
            acc.push(newRecipe);
        }
        
        return acc;
    }, []);
}