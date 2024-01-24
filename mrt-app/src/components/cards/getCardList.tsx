
export const GetCardList = async () => {    
    const response = await fetch('http://localhost:5000/cards/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    return data;
}