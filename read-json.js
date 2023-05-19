import fetch from 'node-fetch';

const readJSONData = () => {
    return new Promise((resolve, reject) => {
    fetch('https://jsonplaceholder.typicode.com/comments')
        .then(async response => {
            try {
                const jsonData = response.json();
                resolve(jsonData);
            } catch (err) {
                reject(err);
            }
        })
        .catch(error => {
            console.log(error);
        });
    });
};

export default readJSONData;