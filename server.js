const fs = require('fs').promises;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function searchKeyByValue(obj, targetValue) {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const result = searchKeyByValue(obj[key], targetValue);
            if (result) return result;
        } else if (obj[key] === targetValue) {
            return key;
        }
    }
    return null;
}

function findValueByKey(obj, targetKey) {
    for (const key in obj) {
        if (key === targetKey) {
            return obj[key];
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const result = findValueByKey(obj[key], targetKey);
            if (result !== undefined) return result;
        }
    }
    return undefined;
}

function updateValueByKey(obj, targetKey, newValue) {
    for (const key in obj) {
        if (key === targetKey) {
            obj[key] = newValue;
            return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const updated = updateValueByKey(obj[key], targetKey, newValue);
            if (updated) return true;
        }
    }
    return false;
}

async function FindAndReplace(filePath, label, edit) {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    const foundKey = searchKeyByValue(jsonData, label);
    if (!foundKey) {
        return { success: false, error: "Value not found" };
    }

    const replaceKey = `${foundKey}_replace`;
    const replaceKeyName = findValueByKey(jsonData, replaceKey);

    if (replaceKeyName === undefined) {
        return { success: false, error: "Replace key not found" };
    }

    const updated = updateValueByKey(jsonData, replaceKeyName, edit);
    if (!updated) {
        return { success: false, error: "Failed to update value" };
    }

    return { success: true, updatedData: jsonData };
}

app.post('/api/elementor-replacer', async (req, res) => {
    try {
        const { label, edit } = req.body;

        if (!label || !edit) {
            return res.status(400).json({ error: 'label and edit are required' });
        }

        const result = await FindAndReplace('./sample.json', label, edit);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        return res.status(200).json(result.updatedData);

    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
